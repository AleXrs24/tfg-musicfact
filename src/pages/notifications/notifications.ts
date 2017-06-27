import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbApiService } from './../../shared/db-api.service';
import { Profile } from './../profile/profile';
import * as _ from 'lodash';

/**
 * Generated class for the Notifications page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class Notifications {
  users: any[];
  notifications_show: any[] = [];
  notifications_list: any[];
  notifications_list_sort: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: DbApiService) {
  }

  ionViewDidLoad() {
    this.db.getUsers().subscribe(resp => {
      this.users = resp;
      this.db.getNotifications().subscribe(resp => {
        this.notifications_list = resp;
        this.notifications_list_sort = _.chain(this.notifications_list).sortBy('time').reverse().value();
        this.notifications_show = [];
        for (let notification of this.notifications_list_sort) {
          this.notifications_show.push(_.find(this.users, (item) => {
            return notification.$key == item.$key;
          }))
        }
      })  
    })
  }

  profileView($event, user) {
    this.navCtrl.push(Profile, user);
  }

}
