import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleCarPage } from './single-car.page';

const routes: Routes = [
  {
    path: '',
    component: SingleCarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleCarPageRoutingModule {}
