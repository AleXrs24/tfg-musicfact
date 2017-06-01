import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Trends } from './trends';

@NgModule({
  declarations: [
    Trends,
  ],
  imports: [
    IonicPageModule.forChild(Trends),
  ],
  exports: [
    Trends
  ]
})
export class TrendsModule {}
