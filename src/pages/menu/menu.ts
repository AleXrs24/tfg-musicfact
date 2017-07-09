import { NotificationsConfig } from './../notifications-config/notifications-config';
import { Notifications } from './../notifications/notifications';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { DbApiService } from './../../shared/db-api.service';
import { AuthService } from './../../providers/auth-service';
import { UploadTrack } from './../upload-track/upload-track';
import { Profile } from './../profile/profile';
import { Trends } from './../trends/trends';
import { Start } from './../auth/start/start';
import * as _ from 'lodash';
import { Push } from '@ionic/cloud-angular';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  users: any;
  userData: any;
  userName: string;
  userImage: string;

  constructor(public navCtrl: NavController, private db: DbApiService, private auth: AuthService, private storage: Storage, private push: Push,
    private ac: AlertController, private toast: ToastController) {
  }

  ionViewDidLoad() {
    this.storage.get('name').then((val) => {
      this.userName = val;
    });

    this.storage.get('image').then((val) => {
      this.userImage = val;
    });

    let currentUser = this.db.getCurrentUser();
    this.db.getUsers().subscribe(resp => {
      this.users = resp;
    });
    this.userData = _.find(this.users, (item) => {
      return item.$key == currentUser.uid;
    });
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

  viewNotifications() {
    this.navCtrl.push(Notifications)
  }

  viewNotificationsConfig() {
    this.navCtrl.push(NotificationsConfig)
  }

  signOut() {
    let confirm = this.ac.create({
      title: 'Cerrar sesión',
      message: '¿Estás seguro?',
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
            this.push.unregister();

            this.auth.signOut().then(() => {
              this.storage.clear();
              let toast = this.toast.create({
                message: 'Has cerrado sesión',
                duration: 3000,
                position: 'top',
                showCloseButton: true,
                closeButtonText: 'Ok'
              });
              toast.present();
              this.navCtrl.parent.parent.setRoot(Start)
            })
          }
        }
      ]
    });
    confirm.present();
  }

}
