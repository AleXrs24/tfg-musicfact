import { Login } from './../login/login';
import { SignUp } from './../sign-up/sign-up';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

/**
 * Generated class for the Start page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class Start {
  isClicked: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modal: ModalController) {
    this.isClicked = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Start');
  }

  openSignUp() {
    let signup = this.modal.create(SignUp);
    this.isClicked = true;
    signup.present();
    signup.onDidDismiss(() => {
      this.isClicked = false;
    });
  }

  openLogin() {
    let login = this.modal.create(Login);
    this.isClicked = true;
    login.present();
    login.onDidDismiss(() => {
      this.isClicked = false;
    });
  }

}
