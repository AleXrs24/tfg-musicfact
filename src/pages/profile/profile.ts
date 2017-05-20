import { AuthService } from './../../providers/auth-service';
import { DbApiService } from './../../shared/db-api.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

/**
 * Generated class for the Profile page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {
  user: any;
  tracks: any[];
  likes: any[];
  reposts: any[];
  isLike: boolean[] = [];
  isRepost: boolean[] = [];
  tracks_posts: any[];
  tracks_filter: any[] = [];
  profile: string = "tracks";
  nfollowers: any = 0;
  nfollowing: any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: DbApiService, private auth: AuthService) {
    this.user = navParams.data;
  }

  ionViewDidLoad() {
    this.db.getTracks().subscribe(resp => {
      this.tracks = resp;
      this.tracks_filter = [];
      this.db.getTracksPosts(this.user.$key).subscribe(resp => {
        this.tracks_posts = resp;
        for (let track of this.tracks_posts) {
          this.tracks_filter = this.tracks.filter((item) => {
            return track.$key == item.$key;
          })
        }
      })

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
    if (this.user.followers) this.nfollowers = Object.keys(this.user.followers).length;
    if (this.user.following) this.nfollowing = Object.keys(this.user.following).length;

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

}
