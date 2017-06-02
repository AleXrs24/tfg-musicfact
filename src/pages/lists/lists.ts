import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, AlertController } from 'ionic-angular';
import { DbApiService } from './../../shared/db-api.service';

import * as _ from 'lodash';
/**
 * Generated class for the Lists page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-lists',
  templateUrl: 'lists.html',
})
export class Lists {
  tracksList: any;
  track: any;
  lists: any;
  currentUser: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vc: ViewController, private db: DbApiService,
    private toast: ToastController, private ac: AlertController) {
      this.track = this.navParams.get("track");
      this.currentUser = this.db.getCurrentUser();
  }

  ionViewDidLoad() {
    this.db.getLists(this.currentUser.uid).subscribe(resp => {
      this.lists = resp;
    });
  }

  addTrackToList(list) {
    if (list.privacy == "Pública" && this.track.privacy == "Privada") {
      let attention = this.toast.create({
        message: 'No se puede añadir una pista privada dentro de una lista pública',
        duration: 3000,
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      attention.present();
    } else {
      this.db.getTracksFromList(list.$key, this.currentUser.uid).subscribe(resp => {
        this.tracksList = resp;
      });

      let value: boolean;
      value = _.some(this.tracksList, (item) => {
        return this.track.$key == item.$key;
      })
      if (value) {
        let toast = this.toast.create({
          message: 'Esta canción ya existe en la lista seleccionada',
          duration: 3000,
          position: 'bottom',
          showCloseButton: true,
          closeButtonText: 'Ok'
        });
        toast.present();
      } else {
        this.db.addTrackToList(list.$key, this.track.$key);
        this.vc.dismiss();
      }
    }
  }

  close() {
    this.vc.dismiss();
  }

}
