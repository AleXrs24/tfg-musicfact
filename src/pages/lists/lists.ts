import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
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
  trackId: any;
  lists: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private vc: ViewController, private db: DbApiService,
    private toast: ToastController) {

    this.trackId = this.navParams.get("track_id");
  }

  ionViewDidLoad() {
    let currentUser = this.db.getCurrentUser();
    this.db.getLists(currentUser.uid).subscribe(resp => {
      this.lists = resp;
    });
  }

  addTrackToList(idlist) {

    this.db.getTracksFromList(idlist).subscribe(resp => {
      this.tracksList = resp;
    });

    let value: boolean;
    value = _.some(this.tracksList, (item) => {
      return this.trackId == item.$key;
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
      this.db.addTrackToList(idlist, this.trackId);
      this.vc.dismiss();
    }
  }

  close() {
    this.vc.dismiss();
  }

}
