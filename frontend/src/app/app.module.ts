import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { FrontLayoutComponent } from './layouts/front-layout/front-layout.component';
import { InterceptorService } from './Providers/core-interceptor/core-interceptor.service';
import { NotifierModule } from 'angular-notifier';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgxSpinnerModule,
    NotifierModule.withConfig({
      // Custom options in here
      position: {
        horizontal: {
          position: "middle",
          //distance: 50,
        },
        vertical: {
          position: "bottom",
          distance: 50,
          gap: 10,
        },
      },
      //behaviour: {
      //  autoHide: false
      //}
    }),
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    FrontLayoutComponent,
    LoginLayoutComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
