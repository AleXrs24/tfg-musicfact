import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Uploading } from './uploading';

@NgModule({
  declarations: [
    Uploading,
  ],
  imports: [
    IonicPageModule.forChild(Uploading),
  ],
  exports: [
    Uploading
  ]
})
export class UploadingModule {}
