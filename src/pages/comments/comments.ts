import { Storage } from '@ionic/storage';
import { DbApiService } from './../../shared/db-api.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as _ from 'lodash';

/**
 * Generated class for the Comments page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html'
})
export class Comments {
  trackId: any;
  comments: any[];
  comments_sort: any[];
  comment: string;
  userImage: string;
  userName: string;
  currentUserId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vc: ViewController, private db: DbApiService, private storage: Storage) {
    this.trackId = this.navParams.get("track_id");
  }

  ionViewDidLoad() {
    this.currentUserId = this.db.getCurrentUser().uid;
    this.db.getComments(this.trackId).subscribe(resp => {
      this.comments = resp;
      this.comments_sort = _.chain(this.comments).sortBy('time').reverse().value();
      this.comments = this.comments_sort;
    });
    this.storage.get('image').then((val) => {
      this.userImage = val;
    });
    this.storage.get('name').then((val) => {
      this.userName = val;
    });
    
  }

  close() {
    this.vc.dismiss();
  }

  addComment() {
    this.db.addComment(this.trackId, this.comment, this.userImage, this.userName);
    this.comment = '';
  }

  removeComment(commentId) {
    this.db.removeComment(this.trackId, commentId);
  }

}
