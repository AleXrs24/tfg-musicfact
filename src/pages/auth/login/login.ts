import { ForgotPassword } from './../forgot-password/forgot-password';
import { DbApiService } from './../../../shared/db-api.service';
import { TabsPage } from './../../tabs/tabs';
import { AuthService } from './../../../providers/auth-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';

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
  myForm: FormGroup;
  users: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vc: ViewController, private auth: AuthService, private ac: AlertController,
    private storage: Storage, private db: DbApiService, private fb: FormBuilder, private modal: ModalController) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  openForgotPassword() {
    let forgotPassword = this.modal.create(ForgotPassword);
    forgotPassword.present();
  }

  login() {
    this.auth.loginWithCredentials(this.myForm.value).then((user) => {
      this.db.getUsers().subscribe(resp => {
        this.users = resp;
        let userData = _.find(this.users, (item) => {
          return item.$key == user.uid;
        });
        let userName = userData.name;
        let userImage = userData.profile_image;
        let userCountry = userData.country;

        //this.storage.clear();
        this.storage.set('name', userName);
        this.storage.set('image', userImage);
        this.storage.set('country', userCountry);
      });

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
