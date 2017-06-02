import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SignUp page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUp {
  form: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vc: ViewController) {
    this.form = {
      email: '',
      password: ''
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUp');
  }

  openForgotPassword() {

  }

  signup() {

  }

  signupWithGoogle() {

  }

  close() {
    this.vc.dismiss();
  }

}
