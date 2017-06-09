import { ViewTrack } from './../view-track/view-track';
import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { DbApiService } from './../../shared/db-api.service';
import { AuthService } from './../../providers/auth-service';
import * as _ from 'lodash';

@Component({
  selector: 'page-likes',
  templateUrl: 'likes.html'
})
export class LikesPage {
  likes: any[];
  tracks: any[];
  tracks_filter: any[] = [];

  constructor(public navCtrl: NavController, private db: DbApiService, private auth: AuthService, private modal: ModalController) {

  }

  ionViewDidLoad() {
    this.db.getTracks().subscribe(resp => {
      this.tracks = resp;
      this.db.getLikes().subscribe(resp => {
        this.likes = resp;
        this.tracks_filter = [];
        for (let track of this.likes) {
          this.tracks_filter.push(_.find(this.tracks, (item) => {
            return track.$key == item.$key;
          }))
        }
      })
    })
  }

  viewTrack(trackid) {
    let modal = this.modal.create(ViewTrack, { trackid: trackid });
    modal.present();
  }

}
