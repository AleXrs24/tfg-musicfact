import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TracksList } from './tracks-list';

@NgModule({
  declarations: [
    TracksList,
  ],
  imports: [
    IonicPageModule.forChild(TracksList),
  ],
  exports: [
    TracksList
  ]
})
export class TracksListModule {}
