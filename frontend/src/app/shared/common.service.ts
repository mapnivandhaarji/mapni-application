import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  rootData: any = {};
    readonly notifier: NotifierService;
    constructor(private http: HttpClient, notifierService: NotifierService ) {
    this.rootData.rootUrl = environment.WebAPIUrl;
    this.rootData.uploadsUrl = environment.uploadsUrl;
        //this.rootData.frontendUrl = environment.frontendUrl;
        this.notifier = notifierService;
  }
  
}
