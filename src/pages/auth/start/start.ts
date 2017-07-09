import { TabsPage } from './../../tabs/tabs';
import { Login } from './../login/login';
import { SignUp } from './../sign-up/sign-up';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController, Platform } from 'ionic-angular';
import { DbApiService } from './../../../shared/db-api.service';
import { AuthService } from './../../../providers/auth-service';
import { Push, PushToken } from '@ionic/cloud-angular';

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
    private auth: AuthService, private ac: AlertController, private db: DbApiService, private push: Push, private toast: ToastController,
    private platform: Platform) {
    this.isClicked = false;
  }

  openSignUp() {
    this.isClicked = true;
    let signup = this.modal.create(SignUp);
    signup.present();
    signup.onDidDismiss(() => {
      this.isClicked = false;
    });
  }

  openLogin() {
    this.isClicked = true;
    let login = this.modal.create(Login);
    login.present();
    login.onDidDismiss(() => {
      this.isClicked = false;
    });
  }

  signInWithFacebook() {
    this.auth.signInWithFacebook().then((res) => {
      this.db.signInWithFacebook(res).then(() => {
        console.log('Datos actualizados');
      }).catch(err => {
        this.showError(err);
      });
      if (this.platform.is('cordova')) {
        this.db.getGlobalConfigValue(res.uid).then(data => {
          
          if (data == true) {
            this.push.register().then((t: PushToken) => {
              return this.push.saveToken(t);
            }).then((t: PushToken) => {
              console.log('Token saved:', t.token);
              this.db.saveUserToken(t.token, res.uid);

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
                });
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
