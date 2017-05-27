import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { DbApiService } from './../../shared/db-api.service';
import firebase from 'firebase';

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
  progress_image: any;
  progress_audio: any;
  audio_blob: any;
  coverpage_url: any;
  audio_url: any;
  newCoverPage: boolean;
  uploadTask_image: any;
  uploadTask_audio: any;
  imageName: any;
  trackName: any;
  selectOptions: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fc: FileChooser,
    private db: DbApiService, private fp: FilePath, private ap: AndroidPermissions, private camera: Camera,
    private as: ActionSheet, private lc: LoadingController) {
    this.coverpage = "https://firebasestorage.googleapis.com/v0/b/soundbase-43813.appspot.com/o/img%2Fcover-pages%2Fmusic-track-default.jpg?alt=media&token=5da65d91-c46c-43a4-b924-437d619d3faf";
    this.track = {
      title: '',
      tag: '',
      privacy: ''
    };
    this.nativepath = "";
    this.progress_image = 0;
    this.progress_audio = 0;
    this.newCoverPage = false;
    this.selectOptions = {
      title: 'Etiquetas disponibles'
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadTrack');
  }

  selectOption() {
    let buttonLabels = ['Cámara', 'Galería'];

    const options: ActionSheetOptions = {
      title: '¿Cómo desea cambiar la portada?',
      //subtitle: 'Elija una opción',
      buttonLabels: buttonLabels,
      //addCancelButtonWithLabel: 'Cancel',
      androidTheme: this.as.ANDROID_THEMES.THEME_HOLO_DARK
    };

    this.as.show(options).then((buttonIndex: number) => {
      if (buttonIndex == 1) {
        const options: CameraOptions = {
          quality: 100,
          sourceType: this.camera.PictureSourceType.CAMERA,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          // targetWidth: 320,
          // targetHeight: 240,
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
          // targetWidth: 320,
          // targetHeight: 240,
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
    let loader = this.lc.create({
      // content: `
      //   <div *ngIf="newCoverPage">
      //     <h3>Portada</h3>
      //     <progress-bar [progress]="progress_image"></progress-bar>
      //   </div>
      //   <h3>Audio</h3>
      //   <progress-bar [progress]="progress_audio"></progress-bar>
      //   `
      content: 'Subiendo...'
    });
    loader.present().then(() => {
      //AUDIO TRACK
      let storageRef: any,
        currentUser: any,
        metadata = {
          contentType: 'audio/mp3'
        };

      storageRef = firebase.storage().ref();
      currentUser = this.db.getCurrentUser().uid;
      this.trackName = "track_" + this.track.title + "_" + currentUser + ".mp3";
      this.uploadTask_audio = storageRef.child('mp3/' + this.trackName).put(this.audio_blob, metadata);

      // Listen for state changes, errors, and completion of the upload.
      this.uploadTask_audio.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          this.progress_audio = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          console.log('Upload is ' + this.progress_audio + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        }, (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              // if (this.newCoverPage && this.progress_image == 100) {
              //   let desertRef = storageRef.child('img/cover-pages/' + this.imageName);
              //   desertRef.delete().then(() => {
              //   }).catch((err) => {
              //     console.log(err);
              //   })
              // }
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, () => {
          // Upload completed successfully, now we can get the download URL
          console.log('Upload is finished');
          this.audio_url = this.uploadTask_audio.snapshot.downloadURL;

          //Upload to Database
          if (this.newCoverPage == false || this.progress_image == 100) {
            this.db.uploadToDatabase(this.db.getCurrentUser().displayName, this.db.getCurrentUser().photoURL,
              this.audio_url, this.coverpage_url, this.track);
            
            loader.dismiss();
            this.navCtrl.popToRoot();
          }
        });

      //COVER PAGE
      if (this.newCoverPage) {
        let byteCharacters = atob(this.coverpageB64);
        let byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        let blob = new Blob([byteArray], { type: 'image/jpg' });

        metadata = {
          contentType: 'image/jpg'
        };

        this.imageName = "cover_page_" + this.track.title + "_" + currentUser + ".jpg";
        this.uploadTask_image = storageRef.child('img/cover-pages/' + this.imageName).put(blob, metadata);

        // Listen for state changes, errors, and completion of the upload.
        this.uploadTask_image.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            this.progress_image = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log('Upload is ' + this.progress_image + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, (error) => {
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
              case 'storage/canceled':
                // User canceled the upload
                // if (this.progress_audio == 100) {
                //   let desertRef = storageRef.child('mp3/' + this.trackName);
                //   desertRef.delete().then(() => {
                //   }).catch((err) => {
                //     console.log(err);
                //   })
                // }
                break;
              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          }, () => {
            // Upload completed successfully, now we can get the download URL
            console.log('Upload is finished');
            this.coverpage_url = this.uploadTask_image.snapshot.downloadURL;

            //Upload to Database
            if (this.progress_audio == 100) {
              this.db.uploadToDatabase(this.db.getCurrentUser().displayName, this.db.getCurrentUser().photoURL,
                this.audio_url, this.coverpage_url, this.track);

              loader.dismiss();
              this.navCtrl.popToRoot();
            }
          });

      } else {
        this.coverpage_url = this.coverpage;
      }

    })

  }

  // cancelUpload() {
  //   if (this.newCoverPage && this.progress_image < 100)
  //     this.uploadTask_image.cancel();

  //   if (this.progress_audio < 100)
  //     this.uploadTask_audio.cancel();

  //   this.progress_image = 0;
  //   this.progress_audio = 0;
  // }

}
