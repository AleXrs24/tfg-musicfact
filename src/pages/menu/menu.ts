import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UploadTrack } from './../upload-track/upload-track';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  constructor(public navCtrl: NavController) {

  }

  uploadTrack() {
    this.navCtrl.push(UploadTrack);
  }
}
