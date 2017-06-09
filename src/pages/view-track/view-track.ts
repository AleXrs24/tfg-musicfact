import { SmartAudio } from './../../providers/smart-audio';
import { Comments } from './../comments/comments';
import { Profile } from './../profile/profile';
import { Storage } from '@ionic/storage';
import { Lists } from './../lists/lists';
import { DbApiService } from './../../shared/db-api.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, ModalController, ToastController, ViewController } from 'ionic-angular';

import * as _ from 'lodash';
/**
 * Generated class for the ViewTrack page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-view-track',
  templateUrl: 'view-track.html',
})
export class ViewTrack {
  likes: any;
  reposts: any;
  trackId: any;
  dataTrack: any;
  userName: string;
  isLike: boolean;
  isRepost: boolean;
  artist: string;
  title: string;
  audio: string;
  cover_page: string;
  nlikes: string;
  nreposts: string;
  ncomments: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: DbApiService, private ac: AlertController, private as: ActionSheetController,
    private modal: ModalController, private toast: ToastController, private storage: Storage, private vc: ViewController, private smartAudio: SmartAudio) {
    this.trackId = this.navParams.get("trackid");
  }

  ionViewDidLoad() {
    this.storage.get('name').then((val) => {
      this.userName = val;
    });

    this.db.getTrack(this.trackId).subscribe(resp => {
      this.dataTrack = resp;
      this.title = this.dataTrack.title;
      this.artist = this.dataTrack.artist;
      this.audio = this.dataTrack.audio;
      this.cover_page = this.dataTrack.cover_page;
      this.nlikes = this.dataTrack.likes;
      this.nreposts = this.dataTrack.reposts;
      this.ncomments = this.dataTrack.comments;
    });

    this.db.getLikes().subscribe(resp => {
      this.likes = resp;
      this.isLike = _.some(this.likes, (item) => {
        return this.trackId == item.$key;
      })
    });

    this.db.getReposts().subscribe(resp => {
      this.reposts = resp;
      this.isRepost = _.some(this.reposts, (item) => {
        return this.trackId == item.$key;
      })
    });

  }

  likeTrack() {
    this.smartAudio.play('likeButton');
    this.db.likeTrack(this.trackId);
  }

  disLikeTrack() {
    this.db.disLikeTrack(this.trackId);
  }

  repostTrack() {
    if (this.dataTrack.privacy == 'Privada') {
      let confirm = this.ac.create({
        title: 'Esta pista ha sido creada como privada',
        message: '¿Desea repostearla a sus seguidores y convertirla en pública?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('No clicked');
            }
          },
          {
            text: 'Sí',
            handler: () => {
              this.db.repostPrivateTrack(this.trackId);
            }
          }
        ]
      });
      confirm.present();
    } else {
      this.db.repostTrack(this.trackId);
    }
  }

  unRepostTrack() {
    this.db.unRepostTrack(this.trackId);
  }

  comments() {
    let modal = this.modal.create(Comments, { track_id: this.trackId });
    modal.present();
  }

  more() {
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
                    let lists = this.modal.create(Lists, { track: this.dataTrack });
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
                                  if (data == 'Pública' && this.dataTrack.privacy == 'Privada') {
                                    let attention = this.toast.create({
                                      message: 'No se puede añadir una pista privada dentro de una lista pública',
                                      duration: 3000,
                                      position: 'bottom',
                                      showCloseButton: true,
                                      closeButtonText: 'Ok'
                                    });
                                    attention.present();
                                  } else {
                                    this.db.newList(data, this.trackId, this.dataTrack.cover_page, title, this.userName);
                                  }
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
          text: 'Share',
          icon: 'share',
          cssClass: 'share',
          handler: () => {
            console.log('Share clicked');
          }
        },
        {
          text: 'Play',
          icon: 'arrow-dropright-circle',
          handler: () => {
            console.log('Play clicked');
          }
        },
        {
          text: 'Cancel',
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

  profileView($event) {
    this.navCtrl.push(Profile, this.dataTrack.artist_id);
  }

  close() {
    this.vc.dismiss();
  }

}
