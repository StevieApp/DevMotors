import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleCarPageRoutingModule } from './single-car-routing.module';

import { SingleCarPage } from './single-car.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleCarPageRoutingModule
  ],
  declarations: [SingleCarPage]
})
export class SingleCarPageModule {}
