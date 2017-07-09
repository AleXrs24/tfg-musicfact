import { AuthService } from './../../../providers/auth-service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, ToastController } from 'ionic-angular';

/**
 * Generated class for the ForgotPassword page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPassword {
  myForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, private lc: LoadingController, private auth: AuthService,
    private vc: ViewController, private toast: ToastController) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  reset() {
    let loading = this.lc.create({
      content: 'Enviando...'
    });
    loading.present();

    this.auth.sendPasswordResetEmail(this.myForm.value).then(data => {
      let toast = this.toast.create({
        message: 'Busca en tu email para ver las instrucciones para cambiar la contraseña',
        duration: 3000,
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      loading.dismiss();
      toast.present();
      this.vc.dismiss();

    }, error => {
      let toast = this.toast.create({
        message: 'La recuperación de la contraseña falló. Dirección de email desconocida',
        duration: 3000,
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      loading.dismiss();
      toast.present();
      this.vc.dismiss();
    })
    
  }

  close() {
    this.vc.dismiss();
  }

}
