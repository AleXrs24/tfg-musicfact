import { SmartAudio } from './../providers/smart-audio';
import { AuthService } from './../providers/auth-service';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
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
  private smartAudio: SmartAudio) {

  }

  ngOnInit() {
    this.platform.ready().then(() => {

      this.auth.isAuthenticated().subscribe(data => {
        if (!this.isAppInitialized) {
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

}