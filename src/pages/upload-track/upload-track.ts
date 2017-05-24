import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DbApiService } from './../../shared/db-api.service';
//import { ChooseMethod } from './../choose-method/choose-method';
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
  track: { title: string, tag: string, privacy: string } = {
    title: '',
    tag: '',
    privacy: ''
  }
  coverpage: string = "https://firebasestorage.googleapis.com/v0/b/soundbase-43813.appspot.com/o/img%2Fcover-pages%2Fmusic-track-default.jpg?alt=media&token=5da65d91-c46c-43a4-b924-437d619d3faf";

  coverpageB64: any;
  nativepath: any = "";
  progress: any = 0;
  audio_blob: any;
  coverpage_url: any;
  audio_url: any;
  newCoverPage: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fc: FileChooser,
    private db: DbApiService, private fp: FilePath, private ap: AndroidPermissions, private camera: Camera) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadTrack');
  }


  updateCoverPage() {
    // let popover = this.po.create(ChooseMethod, { cover_page: this.coverpage });
    // popover.present({
    //   ev: myEvent
    // });
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 320,
      targetHeight: 240,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };

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
    //COVER PAGE
    if (this.newCoverPage) {
      let byteCharacters = atob(this.coverpageB64);
      let byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      let blob = new Blob([byteArray], { type: 'image/jpg' });

      let storageRef: any,
        imageName: any,
        uploadTask: any,
        currentUser: any,
        metadata = {
          contentType: 'image/jpg'
        };

      storageRef = firebase.storage().ref();
      currentUser = this.db.getCurrentUser().uid;
      imageName = "cover_page_" + this.track.title + "_" + currentUser + ".jpg";
      uploadTask = storageRef.child('img/cover-pages/' + imageName).put(blob, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          let progress_image = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress_image + '% done');
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
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, () => {
          // Upload completed successfully, now we can get the download URL
          console.log('Upload is finished');
          this.coverpage_url = uploadTask.snapshot.downloadURL;
        });


    } else {
      this.coverpage_url = this.coverpage;
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //AUDIO TRACK
    let storageRef: any,
      trackName: any,
      uploadTask: any,
      currentUser: any,
      metadata = {
        contentType: 'audio/mp3'
      };

    storageRef = firebase.storage().ref();
    currentUser = this.db.getCurrentUser().uid;
    trackName = "track_" + this.track.title + "_" + currentUser + ".mp3";
    uploadTask = storageRef.child('mp3/' + trackName).put(this.audio_blob, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        this.progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log('Upload is ' + this.progress + '% done');
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
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, () => {
        // Upload completed successfully, now we can get the download URL
        console.log('Upload is finished');
        let downloadURL = uploadTask.snapshot.downloadURL;
        this.audio_url = downloadURL;

        //Upload to Database
        this.db.uploadToDatabase(this.db.getCurrentUser().displayName, this.db.getCurrentUser().photoURL,
          this.audio_url, this.coverpage_url, this.track);

        this.navCtrl.popToRoot();
      });

  }

}
