import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Sort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from "rxjs";
declare const $: any;
import Swal from "sweetalert2";

@Component({
  selector: 'app-assing-application-list',
  templateUrl: './assing-application-list.component.html',
  styleUrls: ['./assing-application-list.component.css']
})
export class AssingApplicationListComponent implements OnInit {
  mySelect;
  noData;
  l: number;
  itemsPerPage: number
  p: number = 1;
  assignApplicationList: any[] | any;
  allassignApplicationmaster: any[] | any;
  assignApplicationMasterList: any[] | any;
  assignApplicationListlength: any;
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

  talukaList: any[] = [];
  yearList: any[] = [];
  talukaId = null;
  villageId = null;
  applicationYear = null;

  constructor(public adminLayoutService: AdminLayoutService, private fb: FormBuilder, public commonService: CommonService, private router: Router) {

  }

  ngOnInit(): void {
    document.title = 'Assigned Application | માપણી વાંધા અરજી';
    this.noData = false;
    this.mySelect = 5;
    this.l = this.itemsPerPage = 30;
    this.getSavryerActiveList();
    this.defaultForm();
    this.config = {
      itemsPerPage: this.itemsPerPage,
      currentPage: this.p,
      totalItems: 0
    }

  }

  itemsPerPageChange(val: any) {
    this.l = this.itemsPerPage = parseInt(val);
    this.getAssignApplicationList();
    this.p = 1;
  }

  getTalukaList() {
    this.talukaList = [];
    let Obj = {
      sarveId: this.sarveId
    }
    this.adminLayoutService.uniquetalukaListForAssignData(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.talukaList = Response.data;

      }
    })
  }

  villageList: any[] = [];

  getVllageList() {
    this.villageList = [];
    let Obj = {
      sarveId: this.sarveId,
      taluka: this.talukaId
    }
    this.adminLayoutService.uniqueVillageListForAssignData(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.villageList = Response.data
      }
    })
  }
  getYearList() {
    this.yearList = [];
    let Obj = {
      sarveId: this.sarveId,
      taluka: this.talukaId,
      village: this.villageId
    }
    this.adminLayoutService.yearListforAssignData(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.yearList = Response.data
      }
    })
  }

  viewAssignedApplication(id) {
    this.router.navigate(['admin/assign-application-list/view-application-details'], {
      queryParams: {
        id: id,
      }
    })
  }

  editApplicationmaster(id) {
    this.router.navigate(['admin/assign-application-list/application-update'], {
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

              this.getAssignApplicationList();
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

  sarveId = null;
  sarveyerActiveList: any[] = [];


  // sarve active list and application assign list
  getSavryerActiveList() {
    this.adminLayoutService.getSarveMasterActiveList().subscribe((response: any) => {
      if (response.meta.code == 200) {
        this.sarveyerActiveList = response.data;
        this.sarveId = response.data[0]._id
        this.getAssignApplicationList();
        this.getTalukaList();
        this.getYearList();
        if (this.talukaId) {
          this.getVllageList();
        }
      }
    })
  }

  onSarveyerChange() {
    this.getTalukaList();
    this.getYearList();
    if (this.talukaId) {
      this.getVllageList();
    }
    this.getAssignApplicationList();
  }


  onTalukaChange() {
    this.getYearList();
    this.villageId = null;
    this.applicationYear = null;
    if (this.talukaId) {
      this.getVllageList();
    }
    this.getAssignApplicationList();
  }

  onVillageChange() {
    this.getYearList();
    this.applicationYear = null;
    this.getAssignApplicationList();
  }


  getAssignApplicationList() {
    this.assignApplicationList = [];
    this.selectedApplicationID = [];




    let Obj = {
      isAssign: true,
      sarveId: this.sarveId,
      taluka: this.talukaId,
      village: this.villageId,
      applicationYear: this.applicationYear,
      searchKey: this.searchTerm,
      sortField: this.sortField,
      sortDirection: this.sortDirection,
      pageNumber: this.p,
      pageSize: this.itemsPerPage
    }
    this.adminLayoutService.getAssignedApplicationList(Obj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.assignApplicationMasterList = Response.data.result;
        this.assignApplicationList = this.assignApplicationMasterList
        this.allassignApplicationmaster = this.assignApplicationList
        this.assignApplicationList = this.assignApplicationMasterList.slice();
        this.assignApplicationListlength = Response.data.totaldata;

        this.config = {
          itemsPerPage: this.itemsPerPage,
          currentPage: this.p,
          totalItems: Response.data.totaldata
        };

        if (this.selectedApplicationID.length != this.assignApplicationList.length) {
          this.applicationIDSelected = false
        }
        this.noData = false;
      } else {
        this.noData = true;
        if (this.selectedApplicationID.length == this.assignApplicationList.length) {
          this.applicationIDSelected = false
        }
      }


      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }
  @ViewChild('search') searchData: ElementRef;
  searchTerm = '';
  config: any;
  sortField = 'MTRno';
  sortDirection = 1;

  // search and sort data
  ngAfterViewInit() {
    debugger
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
            this.getAssignApplicationList();
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
        this.getAssignApplicationList();
      }, 900);
    }
  }
  sortData(sort: Sort) {
    this.sortField = sort.active;
    this.sortDirection = sort.direction == 'asc' ? 1 : sort.direction == 'desc' ? -1 : 1;
    this.getAssignApplicationList();
  }

  setPage(page: number) {
    this.p = page;
    this.getAssignApplicationList();
  }



  //selected application id
  onClickSelectAllApplicationID() {
    for (var i = 0; i < this.assignApplicationList.length; i++) {

      this.assignApplicationList[i].isSelected = this.applicationIDSelected;
    }
    this.getCheckedApplicationList();
  }
  getCheckedApplicationList() {
    this.checkedApplicationID = [];
    this.selectedApplicationID = [];
    // this.selectedHsCodeList = [];
    for (var i = 0; i < this.assignApplicationList.length; i++) {
      if (this.assignApplicationList[i].isSelected)
        this.checkedApplicationID.push(this.assignApplicationList[i]);
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
      if (this.selectedApplicationID.length == this.assignApplicationList.length) {
        this.applicationIDSelected = true
      }
    }
    else {
      const index = this.selectedApplicationID.indexOf(Id);
      if (index > -1) {
        this.selectedApplicationID.splice(index, 1);
      }
      if (this.selectedApplicationID.length != this.assignApplicationList.length) {
        this.applicationIDSelected = false
      }
    }
    console.log(this.selectedApplicationID)
  }

  // application assign modal open and close and assign api calling
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
  closeAssignModal() {
    this.defaultForm();
    this.submittedApplicationAssignData = false;
    $("#assign-application-modal").modal("hide");
  }
  assignApplicationData() {
    if (this.assignApplicationForm.invalid) {
      this.submittedApplicationAssignData = true;
      return
    }
    let Obj = {
      sarveId: this.assignApplicationForm.value.sarveId,
      assignDate: this.assignApplicationForm.value.assignDate,
      applicationId: this.selectedApplicationID,
      isAssign: true
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
        this.getAssignApplicationList();
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



}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
