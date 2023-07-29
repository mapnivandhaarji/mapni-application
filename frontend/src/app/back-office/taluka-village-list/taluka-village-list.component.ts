import { Component, OnInit } from '@angular/core';
import { AdminLayoutService } from 'app/layouts/admin-layout/admin-layout.service';

@Component({
  selector: 'app-taluka-village-list',
  templateUrl: './taluka-village-list.component.html',
  styleUrls: ['./taluka-village-list.component.css']
})
export class TalukaVillageListComponent implements OnInit {

  l: number;
  p: number = 1;
  itemsPerPage: number
  itemList = [
    { value: 30, name: '30' },
    { value: 50, name: '50' },
    { value: 100, name: '100' },
    { value: 150, name: '150' },
    { value: 200, name: '200' },
    { value: 300, name: '300' }
  ];

  talukaList: any[] = [];
  villageList: any[] = [];
  allVillageList: any[] = [];
  talukaId = null;
  villageId = null;
  noData: boolean = false;

  constructor(public adminLayoutService: AdminLayoutService,) { }

  ngOnInit(): void {
    document.title = 'Taluka Village List | માપણી વાંધા અરજી';
    this.l = this.itemsPerPage = 30;
    this.p = 1;
    this.getTalukaList();
    this.getVillageListByTalukaId();
  }

  itemsPerPageChange(val: any) {
    this.l = this.itemsPerPage = parseInt(val);
    this.p = 1;
  }


  getTalukaList() {
    this.adminLayoutService.talukaList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.talukaList = Response.data
      }
    })
  }
  getVillageListByTalukaId() {
    this.villageList = []
    let Obj = {
      talukaId: this.talukaId
    }
    this.adminLayoutService.villageListByTalukaID(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.allVillageList = Response.data;
        this.villageList = this.allVillageList
      }
    })
  }

  search(value: any) {
    this.villageList = this.allVillageList.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.villageList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

}
