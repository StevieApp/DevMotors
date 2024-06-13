import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getFirestore, query, collection, where, getDocs } from 'firebase/firestore';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.page.html',
  styleUrls: ['./brand.page.scss'],
})
export class BrandPage implements OnInit {

  brand: any;
  products: any = [];
  db: any;

  constructor(private route: ActivatedRoute) {
    this.db = getFirestore();
    this.brand = this.route.snapshot.paramMap.get('name');
    this.getProducts();
  }

  ngOnInit() {
  }

  async getProducts(){
    var mydata: any[] = []
    const q = query(collection(this.db, "vehicles"), where("brand", "==", this.brand));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var newitem: any = doc.data();
      newitem.id = doc.id;
      mydata.push(newitem);
    });
    this.products = mydata;
  }

}
