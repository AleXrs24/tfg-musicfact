import { MenuPage } from './../menu/menu';
import { Component } from '@angular/core';

import { SearchPage } from '../search/search';
import { LikesPage } from '../likes/likes';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = SearchPage;
  tab3Root = LikesPage;
  tab4Root = MenuPage;
  constructor() {

  }
}
