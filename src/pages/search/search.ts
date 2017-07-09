import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ViewTrack } from './../view-track/view-track';
import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { DbApiService } from './../../shared/db-api.service';
import { Profile } from './../profile/profile';
import * as _ from 'lodash';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  tracks: any[];
  users: any[];
  following: any[];
  isFollowed: boolean[] = [];
  search: string = "tracks";
  userName: string;

  constructor(public navCtrl: NavController, private db: DbApiService, private modal: ModalController, private storage: Storage,
    private http: Http) {

  }

  ionViewDidLoad() {
    this.storage.get('name').then((val) => {
      this.userName = val;
    });

    this.db.getTracks().subscribe(resp => {
      this.tracks = resp;
      this.tracks = this.tracks.filter((item) => {
        return (item.privacy != 'Privada');
      })
    });
    this.db.getUsers().subscribe(resp => {
      this.users = resp;
      this.users = this.users.filter((item) => {
        return (item.$key != this.db.getCurrentUser().uid);
      })
      this.updateUsersList();
    })
  }

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

  followUser(user) {
    this.db.followUser(user.$key);
    this.db.addNotification(user.$key);

    let url = 'https://fcm.googleapis.com/fcm/send';

    let body =
      {
        "to": user.token,
        "notification": {
          "title": "¡Tienes un nuevo seguidor!",
          "body": this.userName
        }
      };

    let headers: Headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'key=' + 'AIzaSyCR2GL7qx22hbSnNhItHUNggffw1DzeGP8'
    });
    let options = new RequestOptions({ headers: headers });

    console.log(JSON.stringify(headers));

    this.http.post(url, body, options).map(response => {
      return response;
    }).subscribe(data => {
      console.log(data);
    });
  }

  unFollowUser(userId) {
    this.db.unFollowUser(userId);
    this.db.removeNotification(userId);
  }

  profileView($event, user) {
    this.navCtrl.push(Profile, user);
  }

  viewTrack(trackid) {
    let modal = this.modal.create(ViewTrack, { trackid: trackid });
    modal.present();
  }
}
