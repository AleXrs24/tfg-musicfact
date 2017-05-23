import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProgressBar } from './progress-bar';

@NgModule({
  declarations: [
    ProgressBar,
  ],
  imports: [
    IonicPageModule.forChild(ProgressBar),
  ],
  exports: [
    ProgressBar
  ]
})
export class ProgressBarModule {}
