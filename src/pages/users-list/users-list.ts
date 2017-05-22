import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbApiService } from './../../shared/db-api.service';
import { Profile } from './../profile/profile';
import * as _ from 'lodash';
/**
 * Generated class for the UsersList page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-users-list',
  templateUrl: 'users-list.html',
})
export class UsersList {
  user: any;
  follow: string;
  users: any[];
  users_show: any[] = [];
  users_list: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: DbApiService) {
    this.user = navParams.get("dataUser");
    this.follow  = navParams.get("dataFollow");
  }

  ionViewDidLoad() {
    this.db.getUsers().subscribe(resp => {
      this.users = resp;
      this.db.getUsersList(this.user.$key, this.follow).subscribe(resp => {
        this.users_list = resp;
        this.users_show = [];
        for (let user of this.users_list) {
          this.users_show.push(_.find(this.users, (item) => {
            return user.$key == item.$key;
          }))
        }
      })  
    })
  }

  profileView($event, user) {
    this.navCtrl.push(Profile, user);
  }

  goTabs(){
    this.navCtrl.popToRoot();
  }

}
