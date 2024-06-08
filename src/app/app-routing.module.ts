import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'brand',
    loadChildren: () => import('./pages/brand/brand.module').then( m => m.BrandPageModule)
  },
  {
    path: 'home-page',
    loadChildren: () => import('./pages/home-page/home-page.module').then( m => m.HomePagePageModule)
  },
  {
    path: 'shop',
    loadChildren: () => import('./pages/shop/shop.module').then( m => m.ShopPageModule)
  },
  {
    path: 'single-car',
    loadChildren: () => import('./pages/single-car/single-car.module').then( m => m.SingleCarPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'add-car',
    loadChildren: () => import('./pages/add-car/add-car.module').then( m => m.AddCarPageModule)
  },
  {
    path: 'add-brand',
    loadChildren: () => import('./pages/add-brand/add-brand.module').then( m => m.AddBrandPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then( m => m.SearchPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
