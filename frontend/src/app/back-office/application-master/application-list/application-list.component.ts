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

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css']
})
export class ApplicationListComponent implements OnInit {

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
  excelUploadForm: FormGroup;
  talukaList: any[] = [];
  yearList: any[] = [];
  config: any;
  get fApplicationAssignData() { return this.assignApplicationForm.controls; }
  submittedApplicationAssignData = false;
  get fExcelUploadData() { return this.excelUploadForm.controls; }
  submittedExcelUploadedData = false;
  applicationIDSelected: boolean = false;
  selectedApplicationID: any[] = [];
  checkedApplicationID = [];
  sarveyerActiveList: any[] = [];
  submittedExcelUploadData = false;
  uploadedDocumentsName: any;
  uploadedDocuments: any;
  productFormObj: any = {};
  @ViewChild('onDocumentAttachments') myInputVariable: ElementRef;
  talukaId = null;
  villageId = null;
  applicationYear = null;
  searchTerm = '';
  sortField = 'MTRno';
  sortDirection = 1;
  @ViewChild('search') searchData: ElementRef;

  constructor(public adminLayoutService: AdminLayoutService, private el: ElementRef, private fb: FormBuilder, public commonService: CommonService, private router: Router) {

  }

  ngOnInit(): void {
    document.title = 'Application | માપણી વાંધા અરજી';
    this.noData = false;
    this.mySelect = 5;
    this.defaultForm();
    this.defaultExcelUploadForm();
    this.l = this.itemsPerPage = 30;
    this.getApplicationMaster();
    this.getSavryerActiveList();
    this.getTalukaList();
    this.getYearList();
    this.getVillageList();
    this.getTalukaListBind();
    this.config = {
      itemsPerPage: this.itemsPerPage,
      currentPage: this.p,
      totalItems: 0
    }
  }

  itemsPerPageChange(val: any) {
    this.l = this.itemsPerPage = parseInt(val);
    this.getApplicationMaster();
    this.p = 1;
  }

  editApplicationmaster(id) {
    this.router.navigate(['admin/application-list/application-update'], {
      queryParams: {
        id: id,
      }
    })
  }

  rejectApplication(id) {

    Swal.fire({
      title: "Delete",
      text: "Are you sure want Delete this Application ?",
      icon: "warning",
      showCancelButton: true,
      //confirmButtonColor: '#3085d6',
      //cancelButtonColor: '#d33',
      confirmButtonText: "Yes, Delete it.",
    }).then((result) => {
      if (result.isConfirmed) {
        let rejectModal = {
          applicationId: id,
        };

        this.adminLayoutService.rejectApplicationByApplicationId(rejectModal).subscribe(
          (Response: any) => {
            if (Response.meta.code == 200) {

              Swal.fire({
                icon: "success",
                text: "Application Deleted Successfully.",
                timer: 1500,
                showCancelButton: false,
                showConfirmButton: false,
              });
              this.getTalukaList();
              this.getYearList();
              this.getApplicationMaster();
            } else {
              Swal.fire({
                icon: "error",
                text: Response.meta.message,
                timer: 1500,
                showCancelButton: false,
                showConfirmButton: false,
              });
              // this.commonService.notifier.notify("error", Response.meta.message);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
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
      isAssign: false,
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

  setPage(page: number) {
    this.p = page;
    this.getApplicationMaster();
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

  sortData(sort: Sort) {
    this.sortField = sort.active;
    this.sortDirection = sort.direction == 'asc' ? 1 : sort.direction == 'desc' ? -1 : 1;
    this.getApplicationMaster();
  }

  onClickSelectAllApplicationID() {
    for (var i = 0; i < this.applicationmasterList.length; i++) {

      this.applicationmasterList[i].isSelected = this.applicationIDSelected;
    }
    this.getCheckedApplicationList();
  }

  getCheckedApplicationList() {
    this.checkedApplicationID = [];
    this.selectedApplicationID = [];
    // this.selectedHsCodeList = [];
    for (var i = 0; i < this.applicationmasterList.length; i++) {
      if (this.applicationmasterList[i].isSelected)
        this.checkedApplicationID.push(this.applicationmasterList[i]);
    }
    if (this.applicationIDSelected === true) {
      this.checkedApplicationID.forEach(e => {
        this.selectedApplicationID.push(e._id);
      })
    }
    else {
      this.checkedApplicationID.forEach(e => {
        const index = this.selectedApplicationID.indexOf(e._id);
        if (index > -1) {
          this.selectedApplicationID.splice(index, 1);
        }
      })
    }
    console.log(this.selectedApplicationID)

  }
  onClickChange(event: any, index: number, Id: any) {
    debugger
    if (event.target.checked === true) {
      this.selectedApplicationID.push(Id);
      if (this.selectedApplicationID.length == this.applicationmasterList.length) {
        this.applicationIDSelected = true
      }
    }
    else {
      const index = this.selectedApplicationID.indexOf(Id);
      if (index > -1) {
        this.selectedApplicationID.splice(index, 1);
      }
      if (this.selectedApplicationID.length != this.applicationmasterList.length) {
        this.applicationIDSelected = false
      }
    }
    console.log(this.selectedApplicationID)
  }
  assignApplicationModalOpen() {
    if (this.selectedApplicationID.length <= 0) {
      Swal.fire({
        icon: "error",
        text: "Please Select At Least 1 Application.",
        timer: 1500,
        showCancelButton: false,
        showConfirmButton: false,
      });
      return
    }
    else {
      this.defaultForm();
      this.submittedApplicationAssignData = false;
      $("#assign-application-modal").modal('show');
    }


  }


  defaultForm() {
    this.assignApplicationForm = this.fb.group({
      sarveId: [null, [Validators.required]],
      assignDate: ['', [Validators.required]]
    })
  }
  defaultExcelUploadForm() {
    this.excelUploadForm = this.fb.group({
      taluka: [null, [Validators.required]],
    })
  }

  getSavryerActiveList() {
    this.adminLayoutService.getSarveMasterActiveList().subscribe((response: any) => {
      if (response.meta.code == 200) {
        this.sarveyerActiveList = response.data
      }
    })
  }

  closeAssignModal() {
    this.defaultForm();
    this.submittedApplicationAssignData = false;
    $("#assign-application-modal").modal("hide");
  }

  getTalukaList() {
    this.talukaList = []
    let Obj = {
      isAssign: false
    }
    this.adminLayoutService.uniquetalukaListForNotAssign(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.talukaList = Response.data
      }
    })
  }
  villageList: any[] = [];
  getVillageList() {
    this.villageList = [];
    let Obj = {
      isAssign: false,
      taluka: this.talukaId
    }
    this.adminLayoutService.uniqueVillageListForNotAssign(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.villageList = Response.data
      }
    })
  }
  getYearList() {
    this.yearList = []
    let Obj = {
      isAssign: false,
      taluka: this.talukaId,
      village: this.villageId
    }
    this.adminLayoutService.yearListforNotAssign(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.yearList = Response.data
      }
    })
  }


  talukaBindList: any[] = [];
  villageBindList: any[] = [];
  getTalukaListBind() {
    this.adminLayoutService.talukaList().subscribe((response: any) => {
      if (response.meta.code == 200) {
        this.talukaBindList = response.data
      }
    })
  }
  getVillageListBindByTalukaBindedList() {
    this.villageBindList = [];
    this.excelUploadForm.controls.village.setValue(null)
    let obj = {
      talukaId: this.excelUploadForm.value.taluka
    }
    this.adminLayoutService.villageListByTalukaID(obj).subscribe((response: any) => {
      if (response.meta.code == 200) {
        this.villageBindList = response.data
      }
    })
  }

  assignApplicationData() {
    if (this.assignApplicationForm.invalid) {
      this.submittedApplicationAssignData = true;
      return
    }
    let Obj = {
      sarveId: this.assignApplicationForm.value.sarveId,
      assignDate: this.assignApplicationForm.value.assignDate,
      isAssign: true,
      applicationId: this.selectedApplicationID
    }

    this.adminLayoutService.assignApplicationIDFromSarveyer(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        Swal.fire({
          icon: "success",
          text: "Application Assign Successfully.",
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
        });
        this.getApplicationMaster();
        this.defaultForm();
        this.submittedApplicationAssignData = false;
        $("#assign-application-modal").modal("hide");
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

  openExcelUploadModal() {
    this.defaultExcelUploadForm();
    this.uploadedDocuments = "";
    this.uploadedDocumentsName = "";
    this.myInputVariable.nativeElement.value = "";
    this.submittedExcelUploadData = false;
    $("#excel-upload-modal").modal("show");
  }

  onDocumentChange(event: any) {

    const inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#onDocumentAttachments');
    const fileCount: number = inputEl.files.length;
    const element = inputEl.files[0];
    this.uploadedDocuments = element;
    this.uploadedDocumentsName = this.uploadedDocuments.name;
    if (this.uploadedDocumentsName) {
      this.submittedExcelUploadData = false
    }
    else {
      this.submittedExcelUploadData = true;
    }
    //Object.keys(inputEl.files).map((obj, i) => {
    //    const element = inputEl.files.item(i);
    //    this.uploadedDocuments.push(element);
    //});
  }

  removeDocument() {
    this.uploadedDocuments = "";
    this.uploadedDocumentsName = "";
    this.myInputVariable.nativeElement.value = "";
    this.submittedExcelUploadData = false;
  }

  uploadExcelFile() {

    if (this.excelUploadForm.invalid || !this.uploadedDocuments || this.uploadedDocuments.length == 0) {
      this.submittedExcelUploadData = true;
      return;
    }

    let applicationExcelUpload: FormData = new FormData();
    applicationExcelUpload.append('taluka', this.excelUploadForm.value.taluka);
    applicationExcelUpload.append('applicationExcelUpload', this.uploadedDocuments);

    this.adminLayoutService.applicationExcelUpload(applicationExcelUpload).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getApplicationMaster();
        this.getTalukaList();
        this.getYearList();
        $("#excel-upload-modal").modal("hide");
        Swal.fire({
          icon: "success",
          text: "Application Excel Uploaded Successfully.",
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
        });
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