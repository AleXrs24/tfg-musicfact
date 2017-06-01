import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { SearchPage } from '../pages/search/search';
import { LikesPage } from '../pages/likes/likes';
import { MenuPage } from './../pages/menu/menu';
import { TabsPage } from '../pages/tabs/tabs';
import { Profile } from './../pages/profile/profile';
import { UsersList } from './../pages/users-list/users-list';
import { Comments } from './../pages/comments/comments';
import { UploadTrack } from './../pages/upload-track/upload-track';
import { Uploading } from './../pages/uploading/uploading';
import { Lists } from './../pages/lists/lists';
import { TracksList } from './../pages/tracks-list/tracks-list';
import { Trends } from './../pages/trends/trends';
import { Start } from './../pages/auth/start/start';
import { Login } from './../pages/auth/login/login';
import { SignUp } from './../pages/auth/sign-up/sign-up';

import { ProgressBar } from './../components/progress-bar/progress-bar';
import { ChartsModule } from 'ng2-charts';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Facebook } from '@ionic-native/facebook';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera } from '@ionic-native/camera';
import { ActionSheet } from '@ionic-native/action-sheet';

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
    TabsPage,
    Profile,
    UsersList,
    Comments,
    UploadTrack,
    ProgressBar,
    Uploading,
    Lists,
    TracksList,
    Trends,
    Start,
    SignUp,
    Login
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SearchPage,
    LikesPage,
    MenuPage,
    TabsPage,
    Profile,
    UsersList,
    Comments,
    UploadTrack,
    Uploading,
    Lists,
    TracksList,
    Trends,
    Start,
    SignUp,
    Login
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DbApiService,
    AuthService,
    Facebook,
    FileChooser,
    FilePath,
    AndroidPermissions,
    Camera,
    ActionSheet
  ]
})
export class AppModule { }
