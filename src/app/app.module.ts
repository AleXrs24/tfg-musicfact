import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { SearchPage } from '../pages/search/search';
import { LikesPage } from '../pages/likes/likes';
import { MenuPage } from './../pages/menu/menu';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Facebook } from '@ionic-native/facebook';
import { DbApiService } from './../shared/db-api.service';
import { AuthService } from '../providers/auth-service';

export const firebaseConfig = {
  apiKey: "AIzaSyDs61mnlefZKQSmb1viYKdxXZcRAlyGxlI",
  authDomain: "soundbase-43813.firebaseapp.com",
  databaseURL: "https://soundbase-43813.firebaseio.com",
  projectId: "soundbase-43813",
  storageBucket: "soundbase-43813.appspot.com",
  messagingSenderId: "847404429996"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SearchPage,
    LikesPage,
    MenuPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SearchPage,
    LikesPage,
    MenuPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DbApiService,
    AuthService,
    Facebook
  ]
})
export class AppModule { }
