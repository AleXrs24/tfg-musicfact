import { DbApiService } from './../../shared/db-api.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import * as _ from 'lodash';

/**
 * Generated class for the Trends page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-trends',
  templateUrl: 'trends.html',
})
export class Trends {
  chartLabels: string[];
  chartData: number[];
  chartType: string;

  tracks: any[];
  PER_deepHouse: any;
  PER_danceEDM: any;
  PER_future: any;
  PER_techno: any;
  PER_pop: any;
  PER_electronic: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: DbApiService) {
    this.chartLabels = ["Deep House", "Dance & EDM", "Future", "Techno", "Pop", "Electronic"];
    this.chartType = 'pie';
    this.update();
  }

  ionViewDidLoad() {

  }

  chartClicked(e:any):void {
    console.log(e);
  }

  chartHovered(e:any): void {
    console.log(e);
  }

  update() {
    this.db.getTracks().subscribe(resp => {
      this.tracks = resp;
    });

    let future = 0;
    let deepHouse = 0;
    let pop = 0;
    let techno = 0;
    let danceEDM = 0;
    let electronic = 0;

    for (let track of _.filter(this.tracks, { 'tag': 'Future' })) {
      future += track.likes;
    }
    for (let track of _.filter(this.tracks, { 'tag': 'Deep House' })) {
      deepHouse += track.likes;
    }
    for (let track of _.filter(this.tracks, { 'tag': 'Pop' })) {
      pop += track.likes;
    }
    for (let track of _.filter(this.tracks, { 'tag': 'Techno' })) {
      techno += track.likes;
    }
    for (let track of _.filter(this.tracks, { 'tag': 'Dance & EDM' })) {
      danceEDM += track.likes;
    }
    for (let track of _.filter(this.tracks, { 'tag': 'Electronic' })) {
      electronic += track.likes;
    }

    let total = future + deepHouse + pop + techno + danceEDM + electronic;

    this.PER_deepHouse = Math.round((deepHouse * 100) / total);
    this.PER_future = Math.round((future * 100) / total);
    this.PER_pop = Math.round((pop * 100) / total);
    this.PER_techno = Math.round((techno * 100) / total);
    this.PER_danceEDM = Math.round((danceEDM * 100) / total);
    this.PER_electronic = Math.round((electronic * 100) / total);

    this.chartData = [this.PER_deepHouse, this.PER_danceEDM, this.PER_future, this.PER_techno, this.PER_pop, this.PER_electronic];
    
  }

}
