import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => import('../pages/home-page/home-page.module').then( m => m.HomePagePageModule)
      },
      {
        path: 'brand/:name',
        loadChildren: () => import('../pages/brand/brand.module').then( m => m.BrandPageModule)
      },
      {
        path: 'show-room',
        loadChildren: () => import('../pages/shop/shop.module').then( m => m.ShopPageModule)
      },
      {
        path: 'single-car/:id',
        loadChildren: () => import('../pages/single-car/single-car.module').then( m => m.SingleCarPageModule)
      },    
      {
        path: 'login',
        loadChildren: () => import('../pages/login/login.module').then( m => m.LoginPageModule)
      },
      {
        path: 'add-vehicle',
        loadChildren: () => import('../pages/add-car/add-car.module').then( m => m.AddCarPageModule)
      },
      {
        path: 'add-brand',
        loadChildren: () => import('../pages/add-brand/add-brand.module').then( m => m.AddBrandPageModule)
      },
      {
        path: 'add-vehicle/:id',
        loadChildren: () => import('../pages/add-car/add-car.module').then( m => m.AddCarPageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('../pages/search/search.module').then( m => m.SearchPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
