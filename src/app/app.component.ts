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

  constructor(private platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private auth: AuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
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
    });
  }

}
