import { DbApiService } from './../../shared/db-api.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

/**
 * Generated class for the NotificationsConfig page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-notifications-config',
  templateUrl: 'notifications-config.html',
})
export class NotificationsConfig {
  globalConfig: boolean = false;
  follower: boolean;
  post: boolean;
  like: boolean;
  repost: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: DbApiService, private toast: ToastController, private ac: AlertController) {
  }

  ionViewDidLoad() {
    let currentUser = this.db.getCurrentUser().uid;
    this.db.getGlobalConfigValue(currentUser).then(data => {
      this.globalConfig = data;
    })
  }

  saveChanges() {
    this.db.updateConfig(this.globalConfig).then(() => {
      let toast = this.toast.create({
        message: 'Configuración guardada. Por favor, es necesario que reinicies tu sesión',
        duration: 3000,
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      toast.present();
    }).catch(error => {
      this.showError(error);
    })
  }

  showError(text) {
    let error = this.ac.create({
      title: 'Error',
      subTitle: text,
      buttons: ['Ok']
    });
    error.present();
  }

}
