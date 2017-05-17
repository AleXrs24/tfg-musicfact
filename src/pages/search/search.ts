import { DbApiService } from './../../shared/db-api.service';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as _ from 'lodash';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  allTracks: any[];
  tracks: any[];
  allTags: any[];

  constructor(public navCtrl: NavController, private db: DbApiService) {

  }

  ionViewDidLoad() {
    this.db.getTracks().subscribe(resp => {
      this.allTracks = resp;
      this.allTags = _.chain(resp).groupBy('tag').toPairs().map(item => _.zipObject(["tagName", "trackTags"], item)).value();
      this.tracks = this.allTags;
    });
  }

  getItems(ev: any) {
    this.ionViewDidLoad();
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.tracks = this.tracks.filter((item) => {
        return (item.tagName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }
}
