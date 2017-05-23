import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DbApiService } from './../../shared/db-api.service';

/**
 * Generated class for the UploadTrack page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-upload-track',
  templateUrl: 'upload-track.html',
})
export class UploadTrack {
  nativepath: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fc: FileChooser,
    private db: DbApiService, private fp: FilePath, private ap: AndroidPermissions) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadTrack');
  }

  uploadMP3() {
    this.ap.requestPermissions([this.ap.PERMISSION.READ_EXTERNAL_STORAGE]);
    this.fc.open().then((uri) => {
      this.fp.resolveNativePath(uri).then(filePath => {
        this.nativepath = filePath;
        (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
          res.file((resFile) => {
            let reader = new FileReader();
            reader.readAsArrayBuffer(resFile);
            reader.onloadend = (evt: any) => {
              let blob = new Blob([evt.target.result], { type: 'audio/mp3' });
              this.db.uploadFile(blob);
            }
          })
        })
      })

    }).catch(e => {
      console.log(e);
    })
  }

}
