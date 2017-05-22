import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UploadTrack } from './upload-track';

@NgModule({
  declarations: [
    UploadTrack,
  ],
  imports: [
    IonicPageModule.forChild(UploadTrack),
  ],
  exports: [
    UploadTrack
  ]
})
export class UploadTrackModule {}
