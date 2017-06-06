import { TabsPage } from './../../tabs/tabs';
import { AuthService } from './../../../providers/auth-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  form: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vc: ViewController, private auth: AuthService, private ac: AlertController) {
    this.form = {
      email: '',
      password: ''
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  openForgotPassword() {

  }

  login() {
    this.auth.loginWithCredentials(this.form).then(() => {
      this.navCtrl.setRoot(TabsPage);
    }).catch(err => {
      this.showError(err);
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

  close() {
    this.vc.dismiss();
  }
}
