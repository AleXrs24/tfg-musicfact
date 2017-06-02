import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private vc: ViewController) {
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

  }

  loginWithGoogle() {

  }

  close() {
    this.vc.dismiss();
  }
}
