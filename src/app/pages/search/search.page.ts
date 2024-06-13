import { Component, NgZone, OnInit } from '@angular/core';
import { Firestore, getFirestore, getDocs, collection } from 'firebase/firestore';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  searchtext: any;
  db!: Firestore;
  isModalOpen: boolean = false;
  maxprice: number = 20000000;
  minprice: number = 50000;
  brands: any [] = [];
  searchbrand: string | undefined;
  pricing: any = {lower: this.minprice, upper: this.maxprice};
  filtering: boolean = false;
  products: any[] = [];
  filteredproducts: any[] = [];

  constructor( private zone: NgZone) {
    this.db = getFirestore();
    this.getBrands();
  }

  ngOnInit() {
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  newMaxMin(val: 'max'| 'min'){
    var myel = document.getElementById('ranger') as HTMLIonRangeElement;
    var reset = this.pricing.upper<this.pricing.lower;
    if(val=='max' && reset){
      this.pricing.upper = this.pricing.lower;
    }else if(val=="min" && reset){
      this.pricing.lower = this.pricing.upper;
    }
    myel.value = this.pricing;
  }

  async getBrands(){
    var mydata: any[] = [];
    const querySnapshot = await getDocs(collection(this.db, "brands"));
    querySnapshot.forEach((doc) => {
      var newitem: any = doc.data();
      newitem.id = doc.id;
      mydata.push(newitem);
    });
    this.brands = mydata.sort((a,b)=>b.timestamp-a.timestamp);
  }

  resetFilters(){
    this.searchbrand = undefined;
    this.pricing.lower = this.minprice;
    this.pricing.upper = this.maxprice;
  }

  async dosearch(){
    await this.getProducts();
    this.filteredproducts = this.products.filter((el: any)=>{
      var intext = false;
      var inrange = false;
      var isbrand = false;
      if(!this.searchtext || this.searchtext==''){
        intext = true;
      }else{
        this.searchtext =  this.searchtext.toLocaleLowerCase();
        const allstrings = this.searchtext.split(' ');
        allstrings.forEach((element: string) => {
          if(JSON.stringify(el).toLocaleLowerCase().includes(element)){
            intext = true
          }
        });
      }
      if(!this.filtering){
        inrange = true;
        isbrand = true;
      }else{
        if(this.searchbrand){
          if(el.brand == this.searchbrand){
            isbrand = true;
          }else{
            isbrand = false;
          }
        }else{
          isbrand = true;
        }
        el.variations.forEach((elem: any)=>{
          if(elem.price>this.pricing.lower && elem.price<this.pricing.upper){
            inrange = true;
          }
        });
      }
      return intext && inrange && isbrand;
    });
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
