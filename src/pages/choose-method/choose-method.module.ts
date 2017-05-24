import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseMethod } from './choose-method';

@NgModule({
  declarations: [
    ChooseMethod,
  ],
  imports: [
    IonicPageModule.forChild(ChooseMethod),
  ],
  exports: [
    ChooseMethod
  ]
})
export class ChooseMethodModule {}
