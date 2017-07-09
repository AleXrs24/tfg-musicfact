import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { DbApiService } from './../../shared/db-api.service';
import { Uploading } from './../uploading/uploading';
import * as _ from 'lodash';

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
  track: { title: string, tag: string, privacy: string };
  coverpage: string;
  coverpageB64: any;
  nativepath: any;
  audio_blob: any;
  newCoverPage: boolean;
  selectOptions: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fc: FileChooser,
    private db: DbApiService, private fp: FilePath, private ap: AndroidPermissions, private camera: Camera,
    private as: ActionSheet, private modalCtrl: ModalController, private lc: LoadingController, private ac: AlertController,
    private toast: ToastController) {
    this.coverpage = "assets/img/start.jpg";
    this.track = {
      title: '',
      tag: '',
      privacy: ''
    };
    this.nativepath = "";
    this.newCoverPage = false;
    this.selectOptions = {
      title: 'Etiquetas disponibles'
    };
  }

  ionViewDidLoad() {

  }

  selectOption() {
    let buttonLabels = ['Cámara', 'Galería'];

    const options: ActionSheetOptions = {
      title: '¿Cómo desea cambiar la portada?',
      buttonLabels: buttonLabels,
      androidTheme: this.as.ANDROID_THEMES.THEME_HOLO_DARK
    };

    this.as.show(options).then((buttonIndex: number) => {
      if (buttonIndex == 1) {
        const options: CameraOptions = {
          quality: 100,
          sourceType: this.camera.PictureSourceType.CAMERA,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          targetWidth: 640,
          targetHeight: 480,
          mediaType: this.camera.MediaType.PICTURE,
          correctOrientation: true
        };
        this.updateCoverPage(options);
      } else if (buttonIndex == 2) {
        const options: CameraOptions = {
          quality: 100,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          targetWidth: 640,
          targetHeight: 480,
          mediaType: this.camera.MediaType.PICTURE,
          correctOrientation: true
        };
        this.updateCoverPage(options);
      }
    });
  }

  updateCoverPage(options) {
    this.camera.getPicture(options).then((data) => {
      this.coverpage = "data:image/jpeg;base64," + data;
      this.coverpageB64 = data;
      this.newCoverPage = true;
    }, (err) => {
      console.log(err);
    });
  }

  loadTrack() {
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
              this.audio_blob = blob;
            }
          })
        })
      })

    }).catch(e => {
      console.log(e);
    })
  }

  uploadTrack() {
    let audio = ['.mp3', '.wav', '.aiff', '.flac', '.alac', '.ogg', '.wma', '.aac'];
    let ext = this.nativepath.substring(this.nativepath.lastIndexOf('.'));
    let value: boolean = false;
    value = _.some(audio, (item) => {
      return ext == item;
    });
    if (value) {
      let modal = this.modalCtrl.create(Uploading, {
        audio_blob: this.audio_blob, coverpageB64: this.coverpageB64,
        newCoverPage: this.newCoverPage, track: this.track, coverpage: this.coverpage
      });
      modal.present();
      modal.onDidDismiss(() => {
        let conf = this.toast.create({
          message: 'Pista de audio subida con éxito',
          duration: 3000,
          position: 'bottom',
          showCloseButton: true,
          closeButtonText: 'Ok'
        });
        conf.present();
        this.navCtrl.popToRoot();
      });
    } else {
      let alert = this.ac.create({
        title: 'Formato de audio no aceptado',
        subTitle: 'Por favor, elija un archivo con una extensión de audio válida',
        buttons: ['De acuerdo']
      });
      alert.present();
    }
  }
}
