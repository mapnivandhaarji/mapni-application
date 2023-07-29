import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Sort } from "@angular/material/sort";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
import * as moment from "moment";
declare const $: any;
import Swal from "sweetalert2";


@Component({
  selector: 'app-application-create',
  templateUrl: './application-create.component.html',
  styleUrls: ['./application-create.component.css']
})
export class ApplicationCreateComponent implements OnInit {

  applicationmasterForm: FormGroup;
  ISeditApplicationMaster = false;

  get fApplicationMasterData() { return this.applicationmasterForm.controls; }
  submittedApplicationMasterData = false;
  applicationId: any;
  url: any;

  constructor(public adminLayoutService: AdminLayoutService, private route: ActivatedRoute, private fb: FormBuilder, public commonService: CommonService, private router: Router) {
    const url = this.router.url;
    this.getTalukaList()

    if (url.includes('application-update')) {
      this.route.queryParams.subscribe((x: any) => {
        this.applicationId = x.id
      });
      this.ISeditApplicationMaster = true;

      this.editApplicationmaster();
    }
    else {
      document.title = 'Application - Create | માપણી વાંધા અરજી';
    }
  }

  ngOnInit(): void {
    if (this.router.url.includes('assign-application-list')) {
      this.url = 'assign-application-list'
    }
    else {
      this.url = 'application-list'
    }

    this.ISeditApplicationMaster = false;
    this.defaultForm();
  }

  defaultForm() {
    this.applicationmasterForm = this.fb.group({
      _id: [''],
      applicantName: [''],
      applicantMobileNo: [''],
      applicantAddress: [''],
      district: [this.districtList[0].value, [Validators.required]],
      taluka: [null, [Validators.required]],
      village: [null, [Validators.required]],
      applicationFullDate: ['', [Validators.required]],
      applicationYear: [''],
      applicationMonth: [''],
      applicationDate: [''],
      newServeNo: ['', [Validators.required]],
      oldServeNo: [''],
      MTRno: ['', [Validators.required]],
    });
  }

  districtList = [
    {
      value: 8,
      name: 'સુરેન્દ્રનગર'
    }
  ];
  talukaList: any[] = [];
  villageList: any[] = [];

  getTalukaList() {
    this.adminLayoutService.talukaList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.talukaList = Response.data
      }
    })
  }
  getVillageListByTalukaId() {
    let Obj = {
      talukaId: this.applicationmasterForm.value.taluka
    }
    this.adminLayoutService.villageListByTalukaID(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.villageList = Response.data
      }
    })
  }

  saveApplicationmaster() {
    if (this.applicationmasterForm.invalid) {
      this.submittedApplicationMasterData = true;
      return;
    }
    let applicationmasterModelObj = {
      "applicantName": this.applicationmasterForm.controls.applicantName.value,
      "applicantMobileNo": this.applicationmasterForm.controls.applicantMobileNo.value,
      "applicantAddress": this.applicationmasterForm.controls.applicantAddress.value,
      "district": this.applicationmasterForm.controls.district.value,
      "taluka": this.applicationmasterForm.controls.taluka.value,
      "village": this.applicationmasterForm.controls.village.value,
      "applicationFullDate": this.applicationmasterForm.controls.applicationFullDate.value,
      "applicationYear": moment(this.applicationmasterForm.controls.applicationFullDate.value).format('yyyy'),
      "applicationMonth": moment(this.applicationmasterForm.controls.applicationFullDate.value).format('MM'),
      "applicationDate": moment(this.applicationmasterForm.controls.applicationFullDate.value).format('DD'),
      "newServeNo": this.applicationmasterForm.controls.newServeNo.value,
      "oldServeNo": this.applicationmasterForm.controls.oldServeNo.value,
      "MTRno": this.applicationmasterForm.controls.MTRno.value,
    };

    this.adminLayoutService.SaveApplicationMaster(applicationmasterModelObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.submittedApplicationMasterData = false;
        this.defaultForm();
        this.ISeditApplicationMaster = false;
        Swal.fire({
          icon: "success",
          text: "Application Master Saved Successfully.",
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
        });
        if (this.router.url.includes('assign-application-list')) {
          this.router.navigate(['admin/assign-application-list'])
        }
        else {
          this.router.navigate(['admin/application-list'])
        }
      }
      else {
        Swal.fire({
          icon: "error",
          text: Response.meta.message,
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
        });
        // this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  editApplicationmaster() {

    let obj = {
      _id: this.applicationId
    }

    this.adminLayoutService.getApplicationMasterById(obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.ISeditApplicationMaster = true;
        this.applicationmasterForm.controls._id.setValue(Response.data._id)
        this.applicationmasterForm.controls.applicantName.setValue(Response.data.applicantName)
        this.applicationmasterForm.controls.applicantMobileNo.setValue(Response.data.applicantMobileNo)
        this.applicationmasterForm.controls.applicantAddress.setValue(Response.data.applicantAddress)
        this.applicationmasterForm.controls.district.setValue(Response.data.district);
        this.applicationmasterForm.controls.taluka.setValue(Response.data.taluka);
        this.getVillageListByTalukaId();
        this.applicationmasterForm.controls.village.setValue(Response.data.village)
        this.applicationmasterForm.controls.applicationFullDate.setValue(new Date(Response.data.applicationFullDate))
        this.applicationmasterForm.controls.applicationYear.setValue(Response.data.applicationYear)
        this.applicationmasterForm.controls.applicationMonth.setValue(Response.data.applicationMonth)
        this.applicationmasterForm.controls.applicationDate.setValue(Response.data.applicationDate)
        this.applicationmasterForm.controls.newServeNo.setValue(Response.data.newServeNo)
        this.applicationmasterForm.controls.oldServeNo.setValue(Response.data.oldServeNo)
        this.applicationmasterForm.controls.MTRno.setValue(Response.data.MTRno)

        document.title = 'Application - ' + this.toTitleCase(Response.data.applicantName) + ' | માપણી વાંધા અરજી'
      }
    })
  }

  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  updateApplicationmaster() {
    if (this.applicationmasterForm.invalid) {
      this.submittedApplicationMasterData = true;
      return;
    }
    let applicationmasterObj = {
      "_id": this.applicationmasterForm.controls._id.value,
      "applicantName": this.applicationmasterForm.controls.applicantName.value,
      "applicantMobileNo": this.applicationmasterForm.controls.applicantMobileNo.value,
      "applicantAddress": this.applicationmasterForm.controls.applicantAddress.value,
      "district": this.applicationmasterForm.controls.district.value,
      "taluka": this.applicationmasterForm.controls.taluka.value,
      "village": this.applicationmasterForm.controls.village.value,
      "applicationFullDate": this.applicationmasterForm.controls.applicationFullDate.value,
      "applicationYear": moment(this.applicationmasterForm.controls.applicationFullDate.value).format('yyyy'),
      "applicationMonth": moment(this.applicationmasterForm.controls.applicationFullDate.value).format('MM'),
      "applicationDate": moment(this.applicationmasterForm.controls.applicationFullDate.value).format('DD'),
      "newServeNo": this.applicationmasterForm.controls.newServeNo.value,
      "oldServeNo": this.applicationmasterForm.controls.oldServeNo.value,
      "MTRno": this.applicationmasterForm.controls.MTRno.value,
    };

    this.adminLayoutService.UpdateApplicationMaster(applicationmasterObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedApplicationMasterData = false;
        this.defaultForm();
        this.ISeditApplicationMaster = false;
        Swal.fire({
          icon: "success",
          text: "Application Master Updated Successfully.",
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
        });
        if (this.router.url.includes('assign-application-list')) {
          this.router.navigate(['admin/assign-application-list'])
        }
        else {
          this.router.navigate(['admin/application-list'])
        }
        // this.commonService.notifier.notify('success', "Module Master Updated Successfully.");
      }
      else {
        Swal.fire({
          icon: "error",
          text: Response.meta.message,
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
        });
        // this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  cancleApplication() {
    if (this.router.url.includes('assign-application-list')) {
      this.router.navigate(['admin/assign-application-list'])
    }
    else {
      this.router.navigate(['admin/application-list'])
    }
  }

}
