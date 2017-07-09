import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, AlertController } from 'ionic-angular';
import { DbApiService } from './../../shared/db-api.service';

import * as _ from 'lodash';
/**
 * Generated class for the Lists page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-lists',
  templateUrl: 'lists.html',
})
export class Lists {
  tracksList: any;
  track: any;
  lists: any;
  currentUser: any;
  userName: string;
  nlists: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vc: ViewController, private db: DbApiService,
    private toast: ToastController, private ac: AlertController, private storage: Storage) {
    this.track = this.navParams.get("track");
    this.currentUser = this.db.getCurrentUser();
  }

  ionViewDidLoad() {
    this.db.getLists(this.currentUser.uid).subscribe(resp => {
      this.lists = resp;
      this.nlists = Object.keys(this.lists).length;
    });
    this.storage.get('name').then((val) => {
      this.userName = val;
    });
  }

  createList() {

    let newList = this.ac.create({
      title: 'Crear nueva lista',
      inputs: [
        {
          name: 'title',
          placeholder: 'Introduce el título de la lista',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Siguiente',
          handler: data => {
            if (data.title != "") {
              let title = data.title;
              let privacy = this.ac.create();
              privacy.setTitle('¿Cómo será la lista?');
              privacy.addInput({
                type: 'radio',
                label: 'Pública',
                value: 'Pública',
                checked: true
              });
              privacy.addInput({
                type: 'radio',
                label: 'Privada',
                value: 'Privada'
              });
              privacy.addButton('Cancelar');
              privacy.addButton({
                text: 'Crear',
                handler: data => {
                  this.db.newList(data, this.track.$key, this.track.cover_page, title, this.userName);
                  let conf = this.toast.create({
                    message: 'Lista creada con éxito',
                    duration: 3000,
                    position: 'bottom',
                    showCloseButton: true,
                    closeButtonText: 'Ok'
                  });
                  conf.present();
                  this.close();
                }
              });
              privacy.present();
            } else {
              return false;
            }
          }
        }
      ]
    });
    newList.present();
  }

  addTrackToList(list) {
    if (list.privacy == "Pública" && this.track.privacy == "Privada") {
      let attention = this.toast.create({
        message: 'No se puede añadir una pista privada dentro de una lista pública',
        duration: 3000,
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      attention.present();
    } else {
      this.db.getTracksFromList(list.$key, this.currentUser.uid).subscribe(resp => {
        this.tracksList = resp;
      });

      let value: boolean;
      value = _.some(this.tracksList, (item) => {
        return this.track.$key == item.$key;
      })
      if (value) {
        let toast = this.toast.create({
          message: 'Esta canción ya existe en la lista seleccionada',
          duration: 3000,
          position: 'bottom',
          showCloseButton: true,
          closeButtonText: 'Ok'
        });
        toast.present();
      } else {
        this.db.addTrackToList(list.$key, this.track.$key);
        let conf = this.toast.create({
          message: 'Canción agregada a la lista seleccionada',
          duration: 3000,
          position: 'bottom',
          showCloseButton: true,
          closeButtonText: 'Ok'
        });
        conf.present();
        this.vc.dismiss();
      }
    }
  }

  close() {
    this.vc.dismiss();
  }

}
