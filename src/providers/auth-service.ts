import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

@Injectable()
export class AuthService {
  private currentUser: firebase.User;

  constructor(private afAuth: AngularFireAuth, private pf: Platform, private fb: Facebook) {
    afAuth.authState.subscribe((user: firebase.User) => {
      if (!user) {
        this.currentUser = null;
        return;
      }
      this.currentUser = user;
      console.log("Current User is: ", this.currentUser.email);
    });
  }

  get authenticated(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  signInWithFacebook() {
    if (this.pf.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return this.afAuth.auth.signInWithCredential(facebookCredential);
      });
    }
    else {
      return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    }
  }

  signInWithCredentials(form): firebase.Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(form.email, form.password);
  }

  loginWithCredentials(form): firebase.Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(form.email, form.password)
  }

  signOut(): firebase.Promise<any> {
    return this.afAuth.auth.signOut();
  }

}
