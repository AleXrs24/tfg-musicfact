import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DbApiService } from './../../shared/db-api.service';
import firebase from 'firebase';

/**
 * Generated class for the Uploading page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-uploading',
  templateUrl: 'uploading.html',
})
export class Uploading {
  track: { title: string, tag: string, privacy: string };
  coverpage: any;
  coverpageB64: any;
  progress_image: any;
  progress_audio: any;
  audio_blob: any;
  coverpage_url: any;
  audio_url: any;
  newCoverPage: boolean;


  constructor(public navCtrl: NavController, public navParams: NavParams, private db: DbApiService, private viewCtrl: ViewController) {
    this.audio_blob = this.navParams.get('audio_blob');
    this.coverpageB64 = this.navParams.get('coverpageB64');
    this.newCoverPage = this.navParams.get('newCoverPage');
    this.track = this.navParams.get('track');
    this.coverpage = this.navParams.get('coverpage');
  }

  ionViewDidLoad() {
    //AUDIO TRACK
    let storageRef: any,
      currentUser: any,
      metadata = {
        contentType: 'audio/mp3'
      };

    storageRef = firebase.storage().ref();
    currentUser = this.db.getCurrentUser().uid;
    let trackName = "track_" + this.track.title + "_" + currentUser + ".mp3";
    let uploadTask_audio = storageRef.child('mp3/' + trackName).put(this.audio_blob, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask_audio.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        this.progress_audio = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log('Upload AUDIO is ' + this.progress_audio + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload AUDIO is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload AUDIO is running');
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
        console.log('Upload AUDIO is finished');
        this.audio_url = uploadTask_audio.snapshot.downloadURL;

        //Upload to Database
        if (this.newCoverPage == false || this.progress_image == 100) {
          this.db.uploadToDatabase(this.db.getCurrentUser().displayName, this.db.getCurrentUser().photoURL,
            this.audio_url, this.coverpage_url, this.track);

          this.dismiss();
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

      let imageName = "cover_page_" + this.track.title + "_" + currentUser + ".jpg";
      let uploadTask_image = storageRef.child('img/cover-pages/' + imageName).put(blob, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask_image.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          this.progress_image = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          console.log('Upload COVER PAGE is ' + this.progress_image + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload COVER PAGE is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload COVER PAGE is running');
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
          console.log('Upload COVER PAGE is finished');
          this.coverpage_url = uploadTask_image.snapshot.downloadURL;

          //Upload to Database
          if (this.progress_audio == 100) {
            this.db.uploadToDatabase(this.db.getCurrentUser().displayName, this.db.getCurrentUser().photoURL,
              this.audio_url, this.coverpage_url, this.track);
            
            this.dismiss(); 
          }
        });

    } else {
      this.coverpage_url = this.coverpage;
    }

  }

  dismiss() {
    this.viewCtrl.dismiss();
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
