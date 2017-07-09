import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsConfig } from './notifications-config';

@NgModule({
  declarations: [
    NotificationsConfig,
  ],
  imports: [
    IonicPageModule.forChild(NotificationsConfig),
  ],
  exports: [
    NotificationsConfig
  ]
})
export class NotificationsConfigModule {}
