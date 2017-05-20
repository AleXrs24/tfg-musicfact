import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersList } from './users-list';

@NgModule({
  declarations: [
    UsersList,
  ],
  imports: [
    IonicPageModule.forChild(UsersList),
  ],
  exports: [
    UsersList
  ]
})
export class UsersListModule {}
