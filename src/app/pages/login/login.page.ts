import { AfterViewInit, Component, OnInit } from '@angular/core';
import { getAuth, EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { auth } from 'firebaseui';
import { Capacitor } from '@capacitor/core'; 
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit {

  reditectto?: string;

  constructor(private platform: Platform) {
    if(platform.is('electron')){
      this.reditectto = './index.html';
    }else{
      this.reditectto = '/add-vehicle'
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    var auther = getAuth();
    var ui = new auth.AuthUI(auther);
    console.log(auther.app.name)
    var loginoptions: any;
    if (Capacitor.isNativePlatform() || this.platform.is('electron')) {
      loginoptions = [{
        provider: EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false
      }]
    }else{
      loginoptions = [{
          provider: EmailAuthProvider.PROVIDER_ID,
          signInMethod: EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
          forceSameDevice: false
        },
        {
          provider: GoogleAuthProvider.PROVIDER_ID,
        }]
    }
    auther.onAuthStateChanged((user) => { 
      if (user) {
        // User logged in already or has just logged in.
        if(user.email){
          console.log(user.email)
        }
      } else {
        // User not logged in or has just logged out.
        ui.start('#firebaser', {
          signInOptions: loginoptions,
          signInSuccessUrl: this.reditectto
        });
      }
    });
  }

}
