import { Component } from '@angular/core';
import { NavController, LoadingController, PopoverController } from 'ionic-angular';

import { DbApiService } from './../../shared/db-api.service';
import { AuthService } from '../../providers/auth-service';
import { Profile } from './../profile/profile';
import { Comments } from './../comments/comments';
import * as _ from 'lodash';
//import { NativeAudio } from '@ionic-native/native-audio';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tracks: any[];
  users: any[];
  likes: any[];
  reposts: any[];
  isLike: boolean[] = [];
  isRepost: boolean[] = [];
  usersFollowing: any[];
  tracks_filter: any[] = [];
  tracks_reposts: any[];
  userData: any[] = [];

  constructor(public navCtrl: NavController, private db: DbApiService, private auth: AuthService,
    private lc: LoadingController, private po: PopoverController) {
  }

  ionViewDidLoad() {
    let loader = this.lc.create({
      content: 'Cargando...'
    });
    loader.present().then(() => {
      this.db.getUsers().subscribe(resp => {
        this.users = resp;
      })

      this.db.getTracks().subscribe(resp => {
        this.tracks = resp;

        this.db.getFollowing().subscribe(resp => {
          this.usersFollowing = resp;
          this.tracks_filter = [];
          this.userData = [];
          for (let user of this.usersFollowing) {
            this.userData.push(_.find(this.users, (item) => {
              return item.$key == user.$key;
            }))
            this.db.getTracksReposts(user.$key).subscribe(resp => {
              this.tracks_reposts = resp;
              for (let track of this.tracks_reposts) {
                let value = _.find(this.tracks, (item) => {
                  return item.$key == track.$key;
                })
                this.tracks_filter.push(value);
              }
            })
          }

          this.db.getLikes().subscribe(resp => {
            this.likes = resp;
            this.isLike = [];
            for (let track of this.tracks_filter) {
              let value: boolean;
              value = _.some(this.likes, (item) => {
                return track.$key == item.$key;
              })
              this.isLike.push(value);
            }
          });

          this.db.getReposts().subscribe(resp => {
            this.reposts = resp;
            this.isRepost = [];
            for (let track of this.tracks_filter) {
              let value: boolean;
              value = _.some(this.reposts, (item) => {
                return track.$key == item.$key;
              })
              this.isRepost.push(value);
            }
          });

        });

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

  repostTrack(track) {
    this.db.repostTrack(track);
  }

  unRepostTrack(track) {
    this.db.unRepostTrack(track);
  }

  comments(track) {
    let popover = this.po.create(Comments, { track_id: track });
    let ev = {
      target: {
        getBoundingClientRect: () => {
          return {
            top: '150'
          };
        }
      }
    };
    popover.present({ev});
  }

  signInWithFacebook(): void {
    this.auth.signInWithFacebook()
      .then((res) => {
        this.db.signInWithFacebook(res);
      });
  }

  profileView($event, user) {
    this.navCtrl.push(Profile, user);
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
