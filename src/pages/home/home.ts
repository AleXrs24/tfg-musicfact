import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { DbApiService } from './../../shared/db-api.service';
import { AuthService } from '../../providers/auth-service';
import * as _ from 'lodash';
//import { NativeAudio } from '@ionic-native/native-audio';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tracks: any[];
  likes: any[];
  isLike: boolean[] = [];

  constructor(public navCtrl: NavController, private db: DbApiService, private auth: AuthService,
    private lc: LoadingController) {
  }

  ionViewDidLoad() {
    let loader = this.lc.create({
      content: 'Por favor espera...'
    });
    loader.present().then(() => {
      this.db.getTracks().subscribe(resp => {
        this.tracks = resp;
        this.db.getLikes().subscribe(resp => {
          this.likes = resp;
          this.isLike = [];
          for (let track of this.tracks) {
            let value: boolean;
            value = _.some(this.likes, (item) => {
              return track.$key == item.$key;
            })
            this.isLike.push(value);
          }
        })
        loader.dismiss();
      });
    });
  }

  likeTrack(track) {
    this.db.likeTrack(track);
  }

  disLikeTrack(track) {
    this.db.disLikeTrack(track);
  }

  signInWithFacebook(): void {
    this.auth.signInWithFacebook()
      .then((res) => {
        this.db.signInWithFacebook(res);
      });
  }

  signOut() {
    this.auth.signOut();
  }

  // ionViewDidLoad() {
  //   for (let track of this.tracks) {
  //     this.nativeAudio.preloadSimple(track.id, track.url);
  //   }
  // }

  // play(id) {
  //   this.nativeAudio.play(id, () => console.log(id + 'is done playing'));
  // }

  // stop(id) {
  //   this.nativeAudio.stop(id);
  // }

}
