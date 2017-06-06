import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DbApiService } from './../../shared/db-api.service';
import { Profile } from './../profile/profile';
import * as _ from 'lodash';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  //allTracks: any[];
  tracks: any[];
  users: any[];
  //allTags: any[];
  following: any[];
  isFollowed: boolean[] = [];

  constructor(public navCtrl: NavController, private db: DbApiService) {

  }

  // ionViewDidLoad() {
  //   this.db.getTracks().subscribe(resp => {
  //     this.allTracks = resp;
  //     this.allTags = _.chain(resp).groupBy('tag').toPairs().map(item => _.zipObject(["tagName", "trackTags"], item)).value();
  //     this.tracks = this.allTags;
  //   });
  // }

  ionViewDidLoad() {
    this.db.getTracks().subscribe(resp => {
      this.tracks = resp;
    });
    this.db.getUsers().subscribe(resp => {
      this.users = resp;
      this.users = this.users.filter((item) => {
        return (item.$key != this.db.getCurrentUser().uid);
      })
      this.updateUsersList();
    })
  }

  // getItems(ev: any) {
  //   this.ionViewDidLoad();
  //   let val = ev.target.value;
  //   if (val && val.trim() != '') {
  //     this.tracks = this.tracks.filter((item) => {
  //       return (item.tagName.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //     });
  //   }
  // }

  getItems(ev: any) {
    this.ionViewDidLoad();
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.tracks = this.tracks.filter((track) => {
        return (track.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      console.log(this.tracks);
      this.users = this.users.filter((user) => {
        return (user.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
    this.updateUsersList();
  }

  updateUsersList() {
    this.db.getFollowing().subscribe(resp => {
      this.following = resp;
      this.isFollowed = [];
      for (let user of this.users) {
        let value: boolean;
        value = _.some(this.following, (item) => {
          return user.$key == item.$key;
        })
        this.isFollowed.push(value);
      }
    })
  }

  followUser(userId) {
    this.db.followUser(userId);
  }

  unFollowUser(userId) {
    this.db.unFollowUser(userId);
  }

  profileView($event, user) {
    this.navCtrl.push(Profile, user);
  }
}
