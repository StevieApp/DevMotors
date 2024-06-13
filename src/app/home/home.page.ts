import { Component } from '@angular/core';
import { getAuth, signOut } from 'firebase/auth';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  email: any;
  brands: any[] = [];
  loggedin = false;
  db: any;

  constructor() {
    var auther = getAuth();
    this.db = getFirestore();
    auther.onAuthStateChanged((user) => { 
      if (user) {
        // User logged in already or has just logged in.
        this.loggedin = true
        if(user.email){
          this.email = 'mailer';
        }else{
          this.email = undefined;
        }
      } else {
        // console.log("Logged out");
        this.loggedin = false;
        this.email = undefined;
      }
    });
    this.getBrands();
  }

  async getBrands(){
    var mydata: any[] = [];
    const querySnapshot = await getDocs(collection(this.db, "brands"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      var newitem: any = doc.data();
      newitem.id = doc.id;
      mydata.push(newitem)
    });
    this.brands = mydata;
  }

  signOuter(){
    var auther = getAuth();
    signOut(auther).then(() => {
      console.log('Sign-out successful')
    }).catch((error) => {
      console.log('An error happened')
    });
  }
}
