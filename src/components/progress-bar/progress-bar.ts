import { Component, Input } from '@angular/core';

/**
 * Generated class for the ProgressBar component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBar {

  @Input('progress') progress;

  constructor() {

  }

  
}
