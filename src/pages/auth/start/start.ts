import { TabsPage } from './../../tabs/tabs';
import { Login } from './../login/login';
import { SignUp } from './../sign-up/sign-up';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { DbApiService } from './../../../shared/db-api.service';
import { AuthService } from './../../../providers/auth-service';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private modal: ModalController,
    private auth: AuthService, private ac: AlertController, private db: DbApiService) {
      this.isClicked = false;
  }

  ionViewDidLoad() {
    console.log("Current User is: ", this.auth.authenticated);
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

  signInWithFacebook() {
    this.auth.signInWithFacebook().then((res) => {
      this.db.signInWithFacebook(res).then(() => {
        this.navCtrl.setRoot(TabsPage);
      }).catch(err => {
        this.showError(err);
      })
    });
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