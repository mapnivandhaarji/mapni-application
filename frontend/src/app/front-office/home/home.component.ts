import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  ip: any;

  constructor(private http: HttpClient,) { }
  
  ngOnInit() {
    
  }
  

}
