import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-single-car',
  templateUrl: './single-car.page.html',
  styleUrls: ['./single-car.page.scss'],
})
export class SingleCarPage implements OnInit {

  selected = 0;
  db: any;
  product: any = {};
  loggedin: any;
  email: any;
  id: any;

  constructor(
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.db = getFirestore();
    this.id = this.route.snapshot.paramMap.get('id');
    this.getProduct();
    var auther = getAuth();
    auther.onAuthStateChanged((user) => { 
      if (user) {
        // User logged in already or has just logged in.
        this.loggedin = true
        if(user.email=="maciauto1@gmail.com" || user.email=="njorogesteve31@gmail.com"){
          // console.log(user.email)
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
  }

  ngOnInit() {
  }

  async getProduct(){
    const docRef = doc(this.db, "vehicles", this.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.product = docSnap.data();
      this.selected = 0;
    } else {
      console.log("No such document!");
      this.toastService.playToast("Product Unavailable", "warning");
    }
  }

}
