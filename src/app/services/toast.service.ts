import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastCtrl: ToastController) {}

  async playToast(message: string, color: 'success'|'danger'|'warning'){
    var toaster = await this.toastCtrl.create({
      message: message,
      duration: 1500,
      color: color,
      mode: 'ios'
    });
    await toaster.present();
  }
  
}
