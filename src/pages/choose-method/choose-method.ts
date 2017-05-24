import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the ChooseMethod page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-choose-method',
  templateUrl: 'choose-method.html',
})
export class ChooseMethod {
  coverpage: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera) {
    this.coverpage = this.navParams.get("cover_page");
  }

  ionViewDidLoad() {

  }


  useCamera() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 320,
      targetHeight: 240,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((data) => {
      this.coverpage = "data:image/jpeg;base64," + data;
    }, (err) => {
      console.log(err);
    });
  }

  usePhotolibrary() {
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
    }, (err) => {
      console.log(err);
    });
  }
}
