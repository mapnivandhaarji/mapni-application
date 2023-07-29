import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CommonService } from '../../shared/common.service';

@Injectable({
  providedIn: 'root'
})
export class LoginLayoutService {
  environment: any;
  constructor(private commonService: CommonService, private http: HttpClient) { }

  userLogin(loginData: any) {
    return this.http.post(this.commonService.rootData.rootUrl + 'adminUser/login', loginData)
  }
}
