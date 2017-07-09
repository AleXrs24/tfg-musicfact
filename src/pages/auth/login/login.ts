import { ForgotPassword } from './../forgot-password/forgot-password';
import { DbApiService } from './../../../shared/db-api.service';
import { TabsPage } from './../../tabs/tabs';
import { AuthService } from './../../../providers/auth-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController, ToastController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { Push, PushToken } from '@ionic/cloud-angular';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';

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
  isClicked: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vc: ViewController, private auth: AuthService, private ac: AlertController,
    private storage: Storage, private db: DbApiService, private fb: FormBuilder, private modal: ModalController, private push: Push, private toast: ToastController,
    private platform: Platform) {
      this.isClicked = false;
      this.myForm = this.fb.group({
        email: ['', [Validators.required]],
        password: ['', [Validators.required]]
      });
  }

  openForgotPassword() {
    this.isClicked = true;
    let forgotPassword = this.modal.create(ForgotPassword);
    forgotPassword.present();
    forgotPassword.onDidDismiss(() => {
      this.isClicked = false;
    });
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

        this.storage.set('name', userName);
        this.storage.set('image', userImage);
        this.storage.set('country', userCountry);
      });
      if (this.platform.is('cordova')) {
        this.db.getGlobalConfigValue(user.uid).then(data => {
          if (data == true) {
            this.push.register().then((t: PushToken) => {
              return this.push.saveToken(t);
            }).then((t: PushToken) => {
              console.log('Token saved:', t.token);
              this.db.saveUserToken(t.token, user.uid);

              this.push.rx.notification()
                .subscribe((msg) => {
                  let noti = this.toast.create({
                    message: msg.title + ': ' + msg.text,
                    duration: 3000,
                    position: 'top',
                    showCloseButton: true,
                    closeButtonText: 'Ok'
                  });
                  noti.present();
                })
            }).catch(err => {
              this.showError(err);
            })
          }
        }).catch(error => {
          this.showError(error);
        })
      }
      let ini = this.toast.create({
        message: 'Has iniciado sesión',
        duration: 3000,
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      ini.present();
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
