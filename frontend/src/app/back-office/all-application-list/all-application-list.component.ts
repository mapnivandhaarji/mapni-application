import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Sort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
import * as e from "express";
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from "rxjs";
declare const $: any;
import Swal from "sweetalert2";
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from "moment";

@Component({
  selector: 'app-all-application-list',
  templateUrl: './all-application-list.component.html',
  styleUrls: ['./all-application-list.component.css']
})
export class AllApplicationListComponent implements OnInit {

  mySelect;
  noData;
  l: number;
  itemsPerPage: number
  p: number = 1;
  applicationmasterList: any[] | any;
  allapplicationmaster: any[] | any;
  applicationMasterList: any[] | any;
  applicationmasterListlength: any;
  itemList = [
    { value: 30, name: '30' },
    { value: 50, name: '50' },
    { value: 100, name: '100' },
    { value: 150, name: '150' },
    { value: 200, name: '200' },
    { value: 300, name: '300' }
  ];
  assignApplicationForm: FormGroup;
  get fApplicationAssignData() { return this.assignApplicationForm.controls; }
  submittedApplicationAssignData = false;
  applicationIDSelected: boolean = false;
  selectedApplicationID: any[] = [];
  checkedApplicationID = [];
  sarveyerActiveList: any[] = [];
  talukaList: any[] = [];
  yearList: any[] = [];

  sortField = 'MTRno';
  sortDirection = 1;
  talukaId = null;
  villageId = null;
  applicationYear = null;
  @ViewChild('search') searchData: ElementRef;
  searchTerm = '';
  config: any;

  constructor(public adminLayoutService: AdminLayoutService, private fb: FormBuilder, public commonService: CommonService, private router: Router) {

  }

  ngOnInit(): void {
    document.title = 'All Application | માપણી વાંધા અરજી';
    this.noData = false;
    this.mySelect = 5;
    this.l = this.itemsPerPage = 30;
    this.getApplicationMaster();
    this.getTalukaList();
    this.getYearList();
    this.config = {
      itemsPerPage: this.itemsPerPage,
      currentPage: this.p,
      totalItems: 0
    }
  }

  getTalukaList() {
    this.talukaList = []
    this.adminLayoutService.uniquetalukaList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.talukaList = Response.data
      }
    })
  }
  villageList: any[] = [];
  getVillageList() {
    this.villageList = [];
    let Obj = {
      taluka: this.talukaId
    }
    this.adminLayoutService.uniqueVillageListForNotAssign(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.villageList = Response.data
      }
    })
  }
  getYearList() {
    this.yearList = [];
    let obj = {
      taluka: this.talukaId,
      village: this.villageId
    }
    this.adminLayoutService.yearList(obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.yearList = Response.data
      }
    })
  }

  itemsPerPageChange(val: any) {
    this.l = this.itemsPerPage = parseInt(val);
    this.getApplicationMaster();
    this.p = 1;
  }

  onTalukaChange() {
    this.getVillageList();
    this.getYearList();
    this.applicationYear = null;
    this.villageId = null;
    this.getApplicationMaster();
  }
  onVillageChange() {
    this.getYearList();
    this.applicationYear = null;
    this.getApplicationMaster();
  }



  getApplicationMaster() {
    this.applicationmasterList = [];
    let obj = {
      isAssign: 'null',
      taluka: this.talukaId,
      village: this.villageId,
      applicationYear: this.applicationYear,
      searchKey: this.searchTerm,
      sortField: this.sortField,
      sortDirection: this.sortDirection,
      pageNumber: this.p,
      pageSize: this.itemsPerPage
    }
    this.adminLayoutService.getApplicationMaster(obj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.applicationMasterList = Response.data.result;
        this.applicationmasterList = this.applicationMasterList
        this.allapplicationmaster = this.applicationmasterList
        this.applicationmasterList = this.applicationMasterList.slice();
        this.applicationmasterListlength = Response.data.totaldata;
        this.applicationIDSelected = false;

        this.config = {
          itemsPerPage: this.itemsPerPage,
          currentPage: this.p,
          totalItems: Response.data.totaldata
        };
        if (this.applicationmasterListlength != 0) {
          this.noData = false;
        }
        else {
          this.noData = true;
        }
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }


  ngAfterViewInit() {
    let lastString = '';
    fromEvent(this.searchData.nativeElement, 'keypress')
      .pipe(

        tap((event: KeyboardEvent) => {
          console.log('keypress seachkey ...................... ', this.searchData.nativeElement.value);

          lastString = this.searchData.nativeElement.value
        })
      )
      .subscribe();

    // server-side search
    fromEvent(this.searchData.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(900),
        distinctUntilChanged(),
        tap((event: KeyboardEvent) => {
          console.log(event);
          if (((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) || event.keyCode == 16 || event.keyCode == 17 || event.keyCode == 32) || ((event.keyCode == 8 || event.keyCode == 13) && lastString.length > 0)) {
            this.getApplicationMaster();
            lastString = this.searchData.nativeElement.value
          }
        })
      )
      .subscribe();
  }

  search(value: any) {
    console.log(this.searchTerm.length);
    if (this.searchTerm.length == 0) {
      setTimeout(() => {
        this.getApplicationMaster();
      }, 900);
    }

    // this.applicationmasterList = this.allapplicationmaster.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
    // this.p = 1;
    // if (this.applicationmasterList.length == 0) {
    //   this.noData = true;
    // } else {
    //   this.noData = false;
    // }
  }

  setPage(page: number) {
    this.p = page;
    this.getApplicationMaster();
  }

  sortData(sort: Sort) {
    this.sortField = sort.active;
    this.sortDirection = sort.direction == 'asc' ? 1 : sort.direction == 'desc' ? -1 : 1;
    this.getApplicationMaster();
  }

  downloadApplicationExcel() {

    let obj = {
      taluka: this.talukaId,
      village: this.villageId,
      applicationYear: this.applicationYear
    }

    this.adminLayoutService.getApplicationExcelDownload(obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {

        console.log(Response.data);

        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Applications');

        worksheet.columns = [
          { header: 'એમ.ટી.આર.નં', key: 'MTRno', width: 25 },
          { header: 'જિલ્લાનું નામ', key: 'districtName', width: 25 },
          { header: 'તાલુકાનું નામ', key: 'talukaName', width: 25 },
          { header: 'ગામનુ નામ', key: 'villageName', width: 25 },
          { header: 'અરજી તારીખ', key: 'applicationFullDate', width: 25 },
          { header: 'અરજદાર નુ નામ', key: 'applicantName', width: 35 },
          { header: 'નવો સર્વે નંબર', key: 'newServeNo', width: 25 },
          { header: 'જુનો સર્વે નંબર', key: 'oldServeNo', width: 25 },
          { header: 'સર્વેયરશ્રી નુ નામ', key: 'sarveName', width: 30 },
          { header: 'સર્વેયરશ્રીને માપણી માટે આપ્યા તારીખ', key: 'assignDate', width: 25 },
        ];
        // worksheet.header([]);

        Response.data.forEach((x: any) => {

          let dataRow = worksheet.addRow({
            MTRno: x.MTRno,
            districtName: "સુરેન્દ્રનગર",
            talukaName: x.talukaName,
            villageName: x.villageName,
            applicationFullDate: new Date(x.applicationFullDate),
            applicantName: x.applicantName,
            newServeNo: x.newServeNo,
            oldServeNo: x.oldServeNo,
            sarveName: x.assignApplicationData[0]?.sarveName,
            assignDate: x.assignApplicationData[0]?.assignDate ? moment(new Date(x.assignApplicationData[0]?.assignDate)).format('DD-MM-yyyy') : '',
          },)

          // const currentRowIdx = worksheet.rowCount;
          // const endColumnIdx = worksheet.columnCount;


          // if (x.assignApplicationData[0]?.sarveName) {

          //   // worksheet.getRow(currentRowIdx).font = { color: { argb: "#FF9494" } }

          //   // dataRow.getCell(currentRowIdx, 1, currentRowIdx, endColumnIdx);
          //   dataRow.fill = {
          //     type: 'pattern',
          //     pattern: 'solid',
          //     bgColor: { argb: '#FF9494' }
          //   }
          // }

        })

        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'application.xlsx');
        })

      }
      else {
        Swal.fire({
          icon: "error",
          text: Response.meta.message,
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
        });
      }
    })


  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
