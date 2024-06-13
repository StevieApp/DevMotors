import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { getFirestore, getDocs, collection } from 'firebase/firestore';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})
export class HomePagePage implements OnInit {

  db: any;
  products: any = [];
  deliverables: any = [
    {
      icon: `https://cdn.pixabay.com/photo/2012/05/07/02/13/accept-47587_1280.png`,
      name: "DELIVERY",
      text: "We deliver immediately"
    },
    {
      icon: `https://cdn.pixabay.com/photo/2016/01/10/22/30/smartphone-1132677_1280.png`,
      name: "ACCESSIBLE",
      text: "Call us anytime"
    },
    {
      icon: `https://cdn.pixabay.com/photo/2016/10/10/14/46/icon-1728563_1280.jpg`,
      name: "VERIFIED",
      text: "Give us the brand we give you the best"
    }
  ]

  constructor(private titleService:Title) {
    this.db = getFirestore();
    titleService.setTitle("Dev Motors");
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
