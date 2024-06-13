import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { getFirestore, getDocs, collection, addDoc, serverTimestamp, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.page.html',
  styleUrls: ['./add-brand.page.scss'],
})
export class AddBrandPage implements OnInit {

  brands: any[] = [];
  newbrand: any;
  db: any;

  constructor(
    private toastService: ToastService, 
    private router: Router
  ) {
    var auther = getAuth();
    auther.onAuthStateChanged((user) => { 
      if (user) {
      // User logged in already or has just logged in.
        if(user.email){
          this.db = getFirestore();
          this.getBrands();
        }else{
          this.router.navigate(['/']);
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit() {
  }

  validateText(){
    return (this.newbrand && this.newbrand.trim().length>2) ? true : false;
  }

  validateUpdate(mystring: string){
    return (mystring && mystring.trim().length>2) ? true : false;
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

  async addBrand(){
    if(!this.validateText()) {this.toastService.playToast("Invalid Brand", 'warning'); return;}
    this.newbrand = this.newbrand.toUpperCase().trim();
    if(this.db){
      await addDoc(collection(this.db, "brands"), {
        name: this.newbrand,
        timestamp: serverTimestamp()
      }).then((ref)=>{
        if(ref.id){
          this.toastService.playToast("Brand Saved", 'success');
          this.newbrand = undefined;
          this.getBrands();
        }else{
          this.toastService.playToast("Brand Not Saved", 'danger');
        }
      },(err)=>{
        console.log(err)
        this.toastService.playToast("Brand couldn't be saved", 'danger');
      });
    }
  }

  async updateBrand(brand: any){
    var myel = document.getElementById('editbrand'+brand.id) as HTMLInputElement;
    if(myel && this.db){
      var myvalue = myel.value;
      myvalue = myel.value = myvalue.toUpperCase().trim();
      if(myvalue == brand.name){this.toastService.playToast("Nothing Changed", 'warning'); return;}
      if(!this.validateUpdate(myvalue)) {this.toastService.playToast("Invalid Brand", 'warning'); return;}
      await setDoc(doc(this.db, "brands", brand.id), {
        name: myvalue,
        timestamp: serverTimestamp()
      }).then(()=>{
        var done =  document.getElementById('saver'+brand.id) as HTMLButtonElement;
        done.click();
        this.toastService.playToast("Brand updated", 'success');
        this.getBrands();
      }, (reason: any)=>{
        console.log(reason);
        this.toastService.playToast("Brand couldn't be updated", 'danger');
      });
    }
  }

  async deleteBrand(id: string){
    if(this.db){
      await deleteDoc(doc(this.db, "brands", id)).then(()=>{
        this.toastService.playToast("Brand deleted", 'success');
        this.getBrands();
      }, (reason:any)=>{
        // console.log(reason);
        this.toastService.playToast("Brand couldn't be deleted", 'danger')
      });
    }
  }
}
