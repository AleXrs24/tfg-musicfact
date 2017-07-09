import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { DbApiService } from './../../../shared/db-api.service';
import { AuthService } from './../../../providers/auth-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import firebase from 'firebase';

import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';


/**
 * Generated class for the SignUp page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUp {
  myForm: FormGroup;
  image_path: string;
  new_image: boolean;
  image: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vc: ViewController, private auth: AuthService,
    private db: DbApiService, private ac: AlertController, private as: ActionSheet, private camera: Camera, private lc: LoadingController,
    private fb: FormBuilder, private toast: ToastController) {
    this.image_path = 'assets/img/profile_image.png';
    this.image = 'assets/img/profile_image.png';
    this.new_image = false;
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^[a-z0-9_-]{6,18}$/)]],
      confirmPassword: [''],
      name: ['', [Validators.required]],
      country: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
    }, {
        validator: this.MatchPassword
      });
  }

  MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value;
    let confirmPassword = AC.get('confirmPassword').value;
    if (password != confirmPassword) {
      AC.get('confirmPassword').setErrors({ MatchPassword: true })
    } else {
      return null
    }
  }

  selectOption() {
    let buttonLabels = ['Cámara', 'Galería'];

    const options: ActionSheetOptions = {
      title: '¿Cómo desea cambiar la foto de perfil?',
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
        this.updateProfileImage(options);
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
        this.updateProfileImage(options);
      }
    });
  }

  updateProfileImage(options) {
    this.camera.getPicture(options).then((data) => {
      this.image_path = "data:image/jpeg;base64," + data;
      this.image = data;
      this.new_image = true;
    }, (err) => {
      console.log(err);
    });
  }

  signup() {
    let loader = this.lc.create({
      content: 'Por favor, espera...'
    });
    loader.present().then(() => {
      this.auth.signInWithCredentials(this.myForm.value).then(res => {
        if (this.new_image) {
          let byteCharacters = atob(this.image);
          let byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          let byteArray = new Uint8Array(byteNumbers);
          let blob = new Blob([byteArray], { type: 'image/jpg' });

          let storageRef: any,
            imageName: any,
            uploadTask: any,
            metadata = {
              contentType: 'image/jpg'
            };

          storageRef = firebase.storage().ref();
          imageName = "profile_image_" + res.uid + ".jpg";
          uploadTask = storageRef.child('img/profile-images/' + imageName).put(blob, metadata);

          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            (snapshot) => {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              console.log('Upload is ' + progress + '% done');
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
              this.image = uploadTask.snapshot.downloadURL;

              this.db.signInWithCredentials(res, this.myForm.value, this.image).then(() => {
                loader.dismiss();
                let conf = this.toast.create({
                  message: 'Te has registrado con éxito. Por favor, ahora inicia sesión',
                  duration: 3000,
                  position: 'bottom',
                  showCloseButton: true,
                  closeButtonText: 'Ok'
                });
                conf.present();
                this.vc.dismiss();
              }).catch(err => {
                this.showError(err);
                loader.dismiss();
              })
            });
        } else {
          this.db.signInWithCredentials(res, this.myForm.value, this.image).then(() => {
            loader.dismiss();
            let conf = this.toast.create({
              message: 'Te has registrado con éxito. Por favor, ahora inicia sesión',
              duration: 3000,
              position: 'bottom',
              showCloseButton: true,
              closeButtonText: 'Ok'
            });
            conf.present();
            this.vc.dismiss();
          }).catch(err => {
            this.showError(err);
            loader.dismiss();
          })
        }
      }).catch(err => {
        this.showError(err);
        loader.dismiss();
      })
    })
  }

  showError(text) {
    let error = this.ac.create({
      title: 'Error',
      subTitle: text,
      buttons: ['Ok']
    });
    error.present();
  }

  close() {
    this.vc.dismiss();
  }

}
