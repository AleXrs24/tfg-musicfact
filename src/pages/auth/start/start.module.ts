import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Start } from './start';

@NgModule({
  declarations: [
    Start,
  ],
  imports: [
    IonicPageModule.forChild(Start),
  ],
  exports: [
    Start
  ]
})
export class StartModule {}
