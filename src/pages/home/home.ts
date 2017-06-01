import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, ActionSheetController, AlertController } from 'ionic-angular';

import { DbApiService } from './../../shared/db-api.service';
import { AuthService } from '../../providers/auth-service';
import { Profile } from './../profile/profile';
import { Comments } from './../comments/comments';
import { Lists } from './../lists/lists';

import * as _ from 'lodash';
//import { NativeAudio } from '@ionic-native/native-audio';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tracks: any[];
  users: any[];
  likes: any[];
  reposts: any[];
  isLike: boolean[] = [];
  isRepost: boolean[] = [];
  usersFollowing: any[];
  tracks_filter: any[] = [];
  tracks_reposts: any[];
  userData: any[] = [];

  constructor(public navCtrl: NavController, private db: DbApiService, private auth: AuthService,
    private lc: LoadingController, private modal: ModalController, private as: ActionSheetController, private ac: AlertController) {
  }

  ionViewDidLoad() {
    let loader = this.lc.create({
      content: 'Cargando...'
    });
    loader.present().then(() => {
      this.db.getUsers().subscribe(resp => {
        this.users = resp;
      })

      this.db.getTracks().subscribe(resp => {
        this.tracks = resp;

        this.db.getFollowing().subscribe(resp => {
          this.usersFollowing = resp;
          this.tracks_filter = [];
          this.userData = [];
          for (let user of this.usersFollowing) {
            this.userData.push(_.find(this.users, (item) => {
              return item.$key == user.$key;
            }))
            this.db.getTracksReposts(user.$key).subscribe(resp => {
              this.tracks_reposts = resp;
              for (let track of this.tracks_reposts) {
                let value = _.find(this.tracks, (item) => {
                  return item.$key == track.$key;
                })
                this.tracks_filter.push(value);
              }
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

        loader.dismiss();

      });
    });
  }

  likeTrack(track) {
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
    // let ev = {
    //   target: {
    //     getBoundingClientRect: () => {
    //       return {
    //         top: '150'
    //       };
    //     }
    //   }
    // };
    modal.present();
  }

  more(track, coverpage) {
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
                    let lists = this.modal.create(Lists, { track_id: track });
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
                                  this.db.newList(data, track, coverpage, title);
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

  signInWithFacebook(): void {
    this.auth.signInWithFacebook()
      .then((res) => {
        this.db.signInWithFacebook(res);
      });
  }

  profileView($event, user) {
    this.navCtrl.push(Profile, user);
  }

  signOut() {
    this.auth.signOut();
  }

  // ionViewDidLoad() {
  //   for (let track of this.tracks) {
  //     this.nativeAudio.preloadSimple(track.id, track.url);
  //   }
  // }

  // play(id) {
  //   this.nativeAudio.play(id, () => console.log(id + 'is done playing'));
  // }

  // stop(id) {
  //   this.nativeAudio.stop(id);
  // }

}
