import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DbApiService } from './../../shared/db-api.service';
import { UploadTrack } from './../upload-track/upload-track';
import { Profile } from './../profile/profile';
import { Trends } from './../trends/trends';
import * as _ from 'lodash';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  users: any;
  userData: any;
  userName: string;
  userImage: string;

  constructor(public navCtrl: NavController, private db: DbApiService) {
  }

  ionViewDidLoad() {
    let currentUser = this.db.getCurrentUser();
    this.db.getUsers().subscribe(resp => {
      this.users = resp;
    });
    this.userData = _.find(this.users, (item) => {
      return item.$key == currentUser.uid;
    });
    this.userName = this.userData.name;
    this.userImage = this.userData.profile_image;
  }

  uploadTrack() {
    this.navCtrl.push(UploadTrack);
  }

  profileView() {
    this.navCtrl.push(Profile, this.userData);
  }

  trends() {
    this.navCtrl.push(Trends);
  }
}
