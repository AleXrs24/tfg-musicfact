import { Lists } from './../lists/lists';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, ActionSheetController, AlertController } from 'ionic-angular';
import { DbApiService } from './../../shared/db-api.service';
import { Comments } from './../comments/comments';

import * as _ from 'lodash';

/**
 * Generated class for the TracksList page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tracks-list',
  templateUrl: 'tracks-list.html',
})
export class TracksList {
  list: any;
  title: any;
  tracks: any[];
  tracks_list: any[];
  tracks_list_sort: any[];
  tracks_filter: any[] = [];
  likes: any[];
  isLike: any[] = [];
  reposts: any[];
  isRepost: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: DbApiService, private lc: LoadingController,
    private modal: ModalController, private as: ActionSheetController, private ac: AlertController) {
    this.list = this.navParams.get("id");
    this.title = this.navParams.get("title");
  }

  ionViewDidLoad() {
    let loader = this.lc.create({
      content: 'Cargando...'
    });
    loader.present().then(() => {

      this.db.getTracks().subscribe(resp => {
        this.tracks = resp;

        this.db.getTracksFromList(this.list).subscribe(resp => {
          this.tracks_list = resp;
          this.tracks_list_sort = _.chain(this.tracks_list).sortBy('time').value();
          this.tracks_filter = [];
          for (let track of this.tracks_list_sort) {
            this.tracks_filter.push(_.find(this.tracks, (item) => {
              return item.$key == track.$key;
            }));
          }
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

      loader.dismiss();

    });
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
    modal.present();
  }

}
