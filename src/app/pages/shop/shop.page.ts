import { Component, OnInit } from '@angular/core';
import { getFirestore, getDocs, collection } from 'firebase/firestore';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {

  db: any;
  products: any = [];

  constructor() {
    this.db = getFirestore();
    this.getProducts();
  }

  ngOnInit() {
  }

  async getProducts(){
    var mydata: any[] = [];
    const querySnapshot = await getDocs(collection(this.db, "vehicles"));
    querySnapshot.forEach((doc) => {
      var newitem: any = doc.data();
      newitem.id = doc.id;
      mydata.push(newitem);
    });
    this.products = mydata.sort((a,b)=>b.timestamp-a.timestamp);
  }

}
