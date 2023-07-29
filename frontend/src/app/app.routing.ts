import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { FrontLayoutComponent } from './layouts/front-layout/front-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin-login/login',
    pathMatch: 'full',
  }, {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
    }]
  }, {
    path: '',
    component: FrontLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./layouts/front-layout/front-layout.module').then(m => m.FrontLayoutModule)
    }]
  }, {
    path: 'admin-login',
    component: LoginLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./layouts/login-layout/login-layout.module').then(m => m.LoginLayoutModule)
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: false
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
