import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
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
import { ForgotPassword } from './../pages/auth/forgot-password/forgot-password';
import { ViewTrack } from './../pages/view-track/view-track';
import { Notifications } from './../pages/notifications/notifications';
import { NotificationsConfig } from './../pages/notifications-config/notifications-config';

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
import { IonicStorageModule } from '@ionic/storage';
import { NativeAudio } from '@ionic-native/native-audio';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Push } from '@ionic-native/push'

import { DbApiService } from './../shared/db-api.service';
import { AuthService } from '../providers/auth-service';
import { SmartAudio } from './../providers/smart-audio';

export const firebaseConfig = {
  apiKey: "AIzaSyDs61mnlefZKQSmb1viYKdxXZcRAlyGxlI",
  authDomain: "soundbase-43813.firebaseapp.com",
  databaseURL: "https://soundbase-43813.firebaseio.com",
  projectId: "soundbase-43813",
  storageBucket: "soundbase-43813.appspot.com",
  messagingSenderId: "847404429996"
};

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'eaf14567'
  },
  'push': {
    'sender_id': '847404429996',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#FF005E'
      }
    }
  }
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
    Login,
    ForgotPassword,
    ViewTrack,
    Notifications,
    NotificationsConfig
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    IonicStorageModule.forRoot(),
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
    Login,
    ForgotPassword,
    ViewTrack,
    Notifications,
    NotificationsConfig
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DbApiService,
    AuthService,
    SmartAudio,
    Facebook,
    FileChooser,
    FilePath,
    AndroidPermissions,
    Camera,
    ActionSheet,
    NativeAudio,
    SocialSharing,
    Push
  ]
})
export class AppModule { }
