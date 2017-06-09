import { SmartAudio } from './../../providers/smart-audio';
import { ViewTrack } from './../view-track/view-track';
import { Storage } from '@ionic/storage';
import { Lists } from './../lists/lists';
import { Comments } from './../comments/comments';
import { UsersList } from './../users-list/users-list';
import { AuthService } from './../../providers/auth-service';
import { DbApiService } from './../../shared/db-api.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { TracksList } from './../tracks-list/tracks-list';
import * as _ from 'lodash';

/**
 * Generated class for the Profile page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {
  user: any;
  tracks: any[];
  likes: any[];
  reposts: any[];
  isLike: boolean[] = [];
  isRepost: boolean[] = [];
  tracks_posts: any[];
  tracks_filter: any[] = [];
  profile: string = "tracks";
  nfollowers: any = 0;
  nfollowing: any = 0;
  isFollowed: boolean;
  following: any[];
  lists: any[];
  lists_filter: any[];
  currentUser: any;
  userName: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private db: DbApiService, private auth: AuthService,
    private modal: ModalController, private as: ActionSheetController, private ac: AlertController, private toast: ToastController, private storage: Storage,
    private smartAudio: SmartAudio) {

    this.user = navParams.data;
  }

  ionViewDidLoad() {
    this.storage.get('name').then((val) => {
      this.userName = val;
    });

    this.currentUser = this.db.getCurrentUser().uid;
    this.db.getTracks().subscribe(resp => {
      this.tracks = resp;
      this.db.getTracksPosts(this.user.$key).subscribe(resp => {
        this.tracks_posts = resp;
        this.tracks_filter = [];
        for (let track of this.tracks_posts) {
          this.tracks_filter.push(_.find(this.tracks, (item) => {
            return track.$key == item.$key;
          }))
        }
        if (this.user.$key != this.currentUser) {
          this.tracks_filter = _.filter(this.tracks_filter, { 'privacy': 'Pública' })
        }
        this.tracks_filter.reverse();
      })

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

    //-----------------------------------------------------------------------

    this.db.getLists(this.user.$key).subscribe(resp => {
      this.lists = resp;
      if (this.user.$key != this.currentUser) {
        this.lists_filter = _.filter(this.lists, { 'privacy': 'Pública' })
      } else {
        this.lists_filter = this.lists;
      }
      this.lists_filter.reverse();
    });

    //----------------------------------------------------------------------

    this.db.getNumFollowers(this.user.$key).subscribe(resp => {
      this.nfollowers = resp;
      this.nfollowers = this.nfollowers.length;
    })

    this.db.getNumFollowing(this.user.$key).subscribe(resp => {
      this.nfollowing = resp;
      this.nfollowing = this.nfollowing.length;
    })

    this.db.getFollowing().subscribe(resp => {
      this.following = resp;
      this.isFollowed = _.some(this.following, (item) => {
        return this.user.$key == item.$key;
      })
    })

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
                                  if (data == 'Pública' && track.privacy == 'Privada') {
                                    let attention = this.toast.create({
                                      message: 'No se puede añadir una pista privada dentro de una lista pública',
                                      duration: 3000,
                                      position: 'bottom',
                                      showCloseButton: true,
                                      closeButtonText: 'Ok'
                                    });
                                    attention.present();
                                  } else {
                                    this.db.newList(data, track.$key, track.cover_page, title, this.userName);
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

  likeTrack(track) {
    this.smartAudio.play('likeButton');
    this.db.likeTrack(track);
  }

  disLikeTrack(track) {
    this.db.disLikeTrack(track);
  }

  repostTrack(track) {
    if (track.privacy == 'Privada') {
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
              this.db.repostPrivateTrack(track.$key);
            }
          }
        ]
      });
      confirm.present();
    } else {
      this.db.repostTrack(track.$key);
    }
  }

  unRepostTrack(track) {
    this.db.unRepostTrack(track);
  }

  followUser(userId) {
    this.db.followUser(userId);
  }

  unFollowUser(userId) {
    this.db.unFollowUser(userId);
  }

  viewUsers(user, follow) {
    this.navCtrl.push(UsersList, { dataUser: user, dataFollow: follow });
  }

  comments(track) {
    let modal = this.modal.create(Comments, { track_id: track });
    modal.present();
  }

  goToTracksList(list, title) {
    this.navCtrl.push(TracksList, { id: list, title: title, user: this.user });
  }

  viewTrack(trackid) {
    let modal = this.modal.create(ViewTrack, { trackid: trackid });
    modal.present();
  }

}
