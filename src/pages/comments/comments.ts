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

  constructor(public navCtrl: NavController, public navParams: NavParams, private vc: ViewController, private db: DbApiService) {
    this.trackId = this.navParams.get("track_id");
  }

  ionViewDidLoad() {
    this.db.getComments(this.trackId).subscribe(resp => {
      this.comments = resp;
      this.comments_sort = _.chain(this.comments).sortBy('time').reverse().value();
      this.comments = this.comments_sort;
    });
  }

  close() {
    this.vc.dismiss();
  }

  addComment() {
    this.db.addComment(this.trackId, this.comment);
    this.comment = '';
  }

}
