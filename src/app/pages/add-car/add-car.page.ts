import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { getDocs, collection, getFirestore, Firestore, addDoc, serverTimestamp, setDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { TextChangeService } from 'src/app/services/text-change.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.page.html',
  styleUrls: ['./add-car.page.scss'],
})
export class AddCarPage implements OnInit {

  product: any;
  newvariation: any;
  selected: any;
  images: any;
  db!: Firestore;
  brands: any[] = [];
  gearshifts: any[] = [
    "MANUAL",
    "AUTOMATIC",
    "MANUAL & AUTOMATIC"
  ];
  fuels: string[] = [
    "PETROL",
    "DIESEL",
    "DIESEL V-POWER",
    "GASOLINE",
    "PREMIUM",
    "ETHANOL",
    "ELECTRIC",
    "UNLEADED-PREMIUM",
    "UNLEADED-SUPER",
    "LOW SULPHUR-DIESEL",
    "UNLEADED"
  ];
  id: any;
  currentproduct: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private textChange: TextChangeService
  ) {
    var auther = getAuth();
    auther.onAuthStateChanged((user) => { 
      if (user) {
        if(user.email){
          this.db = getFirestore();
          this.getBrands();
          this.id = route.snapshot.params['id'];
          if(this.id){
            // console.log(this.id);
            this.getProduct();
          }else{
            this.resetProduct();
          }
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

  signOuter(email: any){
    var auther = getAuth();
    signOut(auther).then(() => {
      console.log('Sign-out successful')
    }).catch((error) => {
      console.log('An error happened')
    });
  }

  async getProduct(){
    const docRef = doc(this.db, "vehicles", this.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.selected = 0;
      this.currentproduct = docSnap.data();
      this.product = docSnap.data();
    } else {
      // console.log("No such document!");
      this.toastService.playToast("Product Unavailable", "warning");
    }
  }

  resetProduct(){
    this.product = {};
    this.product.variations = [];
    this.selected = 0;
  }

  validateText(){
    return (this.newvariation && this.newvariation.trim().length>2) ? true : false;
  }

  addVariation(){
    if(!this.validateText()) {this.toastService.playToast("Invalid Variation", 'warning'); return;}
    this.newvariation = this.newvariation.trim();
    this.product.variations.push({ name: this.newvariation, images: [] });
    this.newvariation = undefined;
  }

  removeVariation(index: number){
    this.product.variations.splice(index, 1);
    if(!this.product.variations[index]){
      if(index>0){
        this.selected = index-1;
      }
    }
  }
  
  checkandsave(event: any, type: string){
    event.preventDefault();
    event.stopPropagation();
    if(type=="drop"){
      var files = event.dataTransfer.files;
      this.saveFiles(files, type);
    }else if(type=="selected"){
      var files = event.target.files;
      this.saveFiles(files, type);
    }
  }

  saveFiles(files: File[], method: 'drop' | 'selected'){
    if(files.length>0){
      this.toastService.playToast("If files aren't images they'll not be uploaded",'warning')
      for (const file of files) {
        if(file.type == "image/png" || file.type == "image/jpg" || file.type == "image/jpeg"){
          this.doUpload(file, file.name);
        }
      } 
    }else{
      if(method == 'drop'){
        this.toastService.playToast("No Images Dropped", 'warning');
      }else{
        this.toastService.playToast("No Images Selected", 'warning');
      }
    }
  }

  doUpload(file: File, filename: string){
    var storage = getStorage();
    var finalfilename = this.textChange.makenumid(8)+this.textChange.getExtension(filename);
    var storageRef = ref(storage, `CarImages/${finalfilename}`);
    var uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default:
            console.log('Upload status unknown');
            break;
        }
      }, 
      (error) => {
        this.toastService.playToast(`${filename} cannot be saved`, 'danger')
      },
      () => {
        this.toastService.playToast(`${filename} saved`, 'success')
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log('File available at', downloadURL);
          this.product.variations[this.selected].images.push(downloadURL);
        });
      }
    );
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

  deleteImage(url: string, index: number){
    const storage = getStorage();
    var storageRef = ref(storage, url);
    deleteObject(storageRef).then(() => {
      this.product.variations[this.selected].images.splice(index, 1);
      this.toastService.playToast('Image deleted', 'success');
    }).catch((error) => {
      this.toastService.playToast('Unable to delete image', 'danger');
    });
  }

  verifyProduct(): boolean{
    if(!this.product.name){
      this.toastService.playToast("Please enter a vehicle name", 'warning');
      return false;
    }else{
      this.product.name = this.product.name.trim();
      if(this.product.name.length<2 || this.product.name.length>150){
        this.toastService.playToast("Invalid vehicle name", 'warning');
        return false;
      }
    }
    if(this.product.discount){
      if(this.product.discount<0 || this.product.discount>100){
        this.toastService.playToast(`Invalid discount for ${this.product.name}`, 'warning');
        return false;
      }
    }
    if(!this.product.description){
      this.toastService.playToast("Please enter a vehicle description", 'warning');
      return false;
    }else{
      this.product.description = this.product.description.trim();
      if(this.product.description.length<10 || this.product.description>1000){
        this.toastService.playToast(`Invalid description for ${this.product.name}. Characters 10->1000.`, 'warning');
        return false;
      }
    }
    if(!this.product.brand){
      this.toastService.playToast("Please select a vehicle brand", 'warning');
      return false;
    }
    if(!this.product.engine_capacity){
      this.toastService.playToast("Please enter vehicle engine capacity in cc", 'warning');
      return false;
    }else{
      if(this.product.engine_capacity<45 || this.product.engine_capacity>50000){
        this.toastService.playToast(`Invalid engine capacity for ${this.product.name}`, 'warning');
        return false;
      }
    }
    if(!this.product.horse_power){
      this.toastService.playToast("Please enter vehicle horse power", 'warning');
      return false;
    }else{
      if(this.product.horse_power<50 || this.product.horse_power>2500){
        this.toastService.playToast(`Invalid horse power for ${this.product.name}`, 'warning');
        return false;
      }
    }
    if(!this.product.max_speed){
      this.toastService.playToast("Please enter vehicle max speed", 'warning');
      return false;
    }else{
      if(this.product.max_speed<10 || this.product.max_speed>1500){
        this.toastService.playToast(`Invalid max speed for ${this.product.name}`, 'warning');
        return false;
      }
    }
    if(!this.product.mileage){
      this.toastService.playToast("Please enter vehicle mileage", 'warning');
      return false;
    }else{
      if(this.product.mileage<0 || this.product.mileage>6000000){
        this.toastService.playToast(`Invalid mileage for ${this.product.name}`, 'warning');
        return false;
      }
    }
    if(!this.product.fuel){
      this.toastService.playToast("Please select fuel used by the vehicle", 'warning');
      return false;
    }
    if(!this.product.gear_shift){
      this.toastService.playToast("Please select gear shift system used by the vehicle", 'warning');
      return false;
    }
    if(!this.product.variations || this.product.variations.length==0){
      this.toastService.playToast("Please add a variation of the vehicle", 'warning');
      return false;
    }else{
      var dexer = 0;
      for (const variation of this.product.variations) {
        if(variation.images.length==0){
          this.toastService.playToast(`Please add the images of the variation ${this.product.variations[dexer].name}`, 'warning');
          return false;
        }
        if(!variation.price){
          this.toastService.playToast(`Please enter the price of the variation ${this.product.variations[dexer].name}`, 'warning');
          return false;
        }else{
          if(variation.price<0 || variation.price>1000000000){
            this.toastService.playToast(`Invalid price for variation ${this.product.variations[dexer].name}`, 'warning');
            return false;
          }
        }
        if(variation.discount){
          if(variation.discount<0 || variation.discount>100){
            this.toastService.playToast(`Invalid discount for variation ${this.product.variations[dexer].name}`, 'warning');
            return false;
          }
        }
        if(variation.description){
          if(variation.description<10 || variation.description>500){
            this.toastService.playToast(`Invalid description for variation ${this.product.variations[dexer].name}. Characters 10->500.`, 'warning');
            return false;
          }
        }
        dexer++;
      }
    }
    return true;
  }

  async saveProduct(){
    if(!this.verifyProduct()){
      return;
    }else{
      this.product.timestamp = serverTimestamp();
      if(this.db){
        await addDoc(collection(this.db, "vehicles"), this.product).then((ref)=>{
          if(ref.id){
            this.toastService.playToast("Vehicle Saved", 'success');
            this.resetProduct();
            // this.getBrands();
          }else{
            this.toastService.playToast("Vehicle Not Saved", 'danger');
          }
        },(err)=>{
          console.log(err)
          this.toastService.playToast("Vehicle couldn't be saved", 'danger');
        });
      }
    }
  }

  verifyUpdate(){
    if(JSON.stringify(this.product) == JSON.stringify(this.currentproduct)){
      this.toastService.playToast(`Vehicle ${this.product.name} wasn't changed`, 'danger');
      return false;
    }else{
      return true;
    }
  }

  async updateProduct(){
    if(!this.verifyProduct() || !this.verifyUpdate()){
      return;
    }else{
      await setDoc(doc(this.db, "vehicles", this.id), this.product).then(()=>{
        this.toastService.playToast(`Vehicle ${this.product.name} updated`, 'success');
        this.getProduct();
        // this.getBrands();
      }, (reason: any)=>{
        console.log(reason);
        this.toastService.playToast("Vehicle ${this.product.name} couldn't be updated", 'danger');
      });
    }
  }

  async deleteProduct(){
    if(this.db){
      await deleteDoc(doc(this.db, "vehicles", this.id)).then(()=>{
        this.toastService.playToast("Vehicle deleted", 'success');
        this.router.navigate(['/show-room']);
      }, (reason:any)=>{
        // console.log(reason);
        this.toastService.playToast("Vehicle couldn't be deleted", 'danger')
      });
    }
  }

}
