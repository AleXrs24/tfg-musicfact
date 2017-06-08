import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewTrack } from './view-track';

@NgModule({
  declarations: [
    ViewTrack,
  ],
  imports: [
    IonicPageModule.forChild(ViewTrack),
  ],
  exports: [
    ViewTrack
  ]
})
export class ViewTrackModule {}
