import { SocialSharing } from '@ionic-native/social-sharing';
import { SmartAudio } from './../../providers/smart-audio';
import { ViewTrack } from './../view-track/view-track';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, Tabs, LoadingController, ModalController, ActionSheetController, AlertController, ToastController } from 'ionic-angular';

import { DbApiService } from './../../shared/db-api.service';
import { AuthService } from '../../providers/auth-service';
import { Profile } from './../profile/profile';
import { Comments } from './../comments/comments';
import { Lists } from './../lists/lists';

import * as _ from 'lodash';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tracks: any[];
  users: any[] = null;
  likes: any[];
  reposts: any[];
  isLike: boolean[] = [];
  isRepost: boolean[] = [];
  usersFollowing: any[];
  tracks_filter: any[] = [];
  tracks_reposts: any[];
  userData: any[] = [];
  userName: string;
  tab: Tabs;
  ntracks: any;

  constructor(public navCtrl: NavController, private db: DbApiService, private auth: AuthService,
    private lc: LoadingController, private modal: ModalController, private as: ActionSheetController, private ac: AlertController, private storage: Storage,
    private smartAudio: SmartAudio, private socialSharing: SocialSharing, private toast: ToastController) {
    this.tab = this.navCtrl.parent;
  }

  ionViewDidLoad() {
    let loader = this.lc.create({
      content: 'Cargando...'
    });
    loader.present().then(() => {
      this.storage.get('name').then((val) => {
        this.userName = val;
      });

      this.db.getUsers().subscribe(resp => {
        this.users = resp;
      })

      setTimeout(() => {
        if (this.users == null) {
          loader.dismiss();
          let alert = this.ac.create({
            title: 'No es posible establecer conexión con el servidor',
            subTitle: 'Por favor, compruebe su conexión a internet',
            buttons: ['De acuerdo']
          });
          alert.present();
        }
      }, 15000);

      this.db.getTracks().subscribe(resp => {
        this.tracks = resp;

        this.db.getFollowing().subscribe(resp => {
          this.usersFollowing = resp;
          this.tracks_filter = [];
          this.userData = [];
          for (let user of this.usersFollowing) {
            this.db.getTracksReposts(user.$key).subscribe(resp => {
              this.tracks_reposts = resp;
              for (let track of this.tracks_reposts) {
                this.userData.push(_.find(this.users, (item) => {
                  return item.$key == user.$key;
                }))
                let value = _.find(this.tracks, (item) => {
                  return item.$key == track.$key;
                })
                this.tracks_filter.push(value);
              }
              this.ntracks = this.tracks_filter.length;
            });

          }

          this.db.getLikes().subscribe(resp => {
            this.likes = resp;
            this.isLike = [];
            for (let track of this.tracks_filter) {
              let value: boolean;
              value = _.some(this.likes, (item) => {
                return track.$key == item.$key;
              })
              this.isLike.push(value);
            }
          });

          this.db.getReposts().subscribe(resp => {
            this.reposts = resp;
            this.isRepost = [];
            for (let track of this.tracks_filter) {
              let value: boolean;
              value = _.some(this.reposts, (item) => {
                return track.$key == item.$key;
              })
              this.isRepost.push(value);
            }
          });

        });

        if (this.ntracks != 0) {
          this.ntracks = 0;
        }
        loader.dismiss();
      });
    });
  }

  goToSearch() {
    this.tab.select(1);
  }

  likeTrack(track) {
    this.smartAudio.play('likeButton');
    this.db.likeTrack(track);
  }

  disLikeTrack(track) {
    this.db.disLikeTrack(track);
  }

  repostTrack(track) {
    this.db.repostTrack(track);
  }

  unRepostTrack(track) {
    this.db.unRepostTrack(track);
  }

  comments(track) {
    let modal = this.modal.create(Comments, { track_id: track });
    modal.present();
  }

  more(track) {
    let more = this.as.create({
      title: 'Más opciones',
      buttons: [
        {
          text: 'Añadir a una lista',
          icon: 'add-circle',
          handler: () => {
            let addToList = this.ac.create({
              title: 'Añadir a una lista',
              buttons: [
                {
                  text: 'Seleccionar lista',
                  handler: data => {
                    let lists = this.modal.create(Lists, { track: track });
                    lists.present();
                  }
                },
                {
                  text: 'Crear nueva lista',
                  handler: () => {
                    let newList = this.ac.create({
                      title: 'Crear nueva lista',
                      inputs: [
                        {
                          name: 'title',
                          placeholder: 'Introduce el título de la lista',
                          type: 'text'
                        }
                      ],
                      buttons: [
                        {
                          text: 'Cancelar',
                          role: 'cancel',
                          handler: data => {
                            console.log('Cancel clicked');
                          }
                        },
                        {
                          text: 'Siguiente',
                          handler: data => {
                            if (data.title != "") {
                              let title = data.title;
                              let privacy = this.ac.create();
                              privacy.setTitle('¿Cómo será la lista?');
                              privacy.addInput({
                                type: 'radio',
                                label: 'Pública',
                                value: 'Pública',
                                checked: true
                              });
                              privacy.addInput({
                                type: 'radio',
                                label: 'Privada',
                                value: 'Privada'
                              });
                              privacy.addButton('Cancelar');
                              privacy.addButton({
                                text: 'Crear',
                                handler: data => {
                                  this.db.newList(data, track.$key, track.cover_page, title, this.userName);
                                  let conf = this.toast.create({
                                    message: 'Lista creada con éxito',
                                    duration: 3000,
                                    position: 'bottom',
                                    showCloseButton: true,
                                    closeButtonText: 'Ok'
                                  });
                                  conf.present();
                                }
                              });
                              privacy.present();
                            } else {
                              return false;
                            }
                          }
                        }
                      ]
                    });
                    newList.present();
                  }
                }
              ]
            });
            addToList.present();
          }
        },
        {
          text: 'Compartir',
          icon: 'share',
          handler: () => {
            this.share(track);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel', // will always sort to be on the bottom
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    more.present();
  }

  profileView($event, user) {
    this.navCtrl.push(Profile, user);
  }

  viewTrack(trackid) {
    let modal = this.modal.create(ViewTrack, { trackid: trackid });
    modal.present();
  }

  share(track) {
    let options = {
      message: track.title,
      subject: track.artist,
      files: null,
      url: track.audio,
      chooserTitle: 'Compartir con'
    }
    this.socialSharing.shareWithOptions(options);
  }

}
