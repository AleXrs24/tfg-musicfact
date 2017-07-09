import { Push, PushToken } from '@ionic/cloud-angular';
import { DbApiService } from './../shared/db-api.service';
import { SmartAudio } from './../providers/smart-audio';
import { AuthService } from './../providers/auth-service';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, ToastController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from './../pages/tabs/tabs';
import { Start } from './../pages/auth/start/start';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = Start;
  isAppInitialized: boolean = false;

  constructor(private platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private auth: AuthService,
    private smartAudio: SmartAudio, private db: DbApiService, private push: Push, private toast: ToastController, private ac: AlertController) {

  }

  ngOnInit() {
    this.platform.ready().then(() => {

      this.auth.isAuthenticated().subscribe(data => {
        if (!this.isAppInitialized) {
          if (this.platform.is('cordova')) {
            this.db.getGlobalConfigValue(data.uid).then(conf => {
              this.push.unregister();
              if (conf == true) {
                this.push.register().then((t: PushToken) => {
                  return this.push.saveToken(t);
                }).then((t: PushToken) => {
                  console.log('Token saved:', t.token);
                  this.db.saveUserToken(t.token, data.uid);

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

          this.nav.setRoot(TabsPage);
          this.isAppInitialized = true;
        }
      }, err => {
        this.nav.setRoot(Start);
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.smartAudio.preload('likeButton', 'assets/audio/soundEffect.m4a')
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