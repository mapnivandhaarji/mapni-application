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
  selector: 'app-sarve-create',
  templateUrl: './sarve-create.component.html',
  styleUrls: ['./sarve-create.component.css']
})
export class SarveCreateComponent implements OnInit {

  sarvemasterForm: FormGroup;
  ISeditSarveMaster = false;

  get fSarveMasterData() { return this.sarvemasterForm.controls; }
  submittedSarveMasterData = false;
  sarveId: any;

  constructor(public adminLayoutService: AdminLayoutService, private route: ActivatedRoute, private fb: FormBuilder, public commonService: CommonService, private router: Router) {
    const url = this.router.url;

    if (url.includes('sarve-update')) {
      this.route.queryParams.subscribe((x: any) => {
        this.sarveId = x.id
      });
      this.ISeditSarveMaster = true;

      this.editSarvemaster();
    }
    else {
      document.title = 'Sarve - Create | માપણી વાંધા અરજી';
    }
  }

  ngOnInit(): void {
    this.ISeditSarveMaster = false;
    this.defaultForm();
  }

  defaultForm() {
    this.sarvemasterForm = this.fb.group({
      _id: [''],
      name: ['', [Validators.required]],
      mobile: [''],
      email: [''],
    });
  }

  saveSarvemaster() {
    if (this.sarvemasterForm.invalid) {
      this.submittedSarveMasterData = true;
      return;
    }
    let sarvemasterModelObj = {
      "name": this.sarvemasterForm.controls.name.value,
      "mobile": this.sarvemasterForm.controls.mobile.value,
      "email": this.sarvemasterForm.controls.email.value,
    };

    this.adminLayoutService.SaveSarveMaster(sarvemasterModelObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.submittedSarveMasterData = false;
        this.defaultForm();
        this.ISeditSarveMaster = false;
        Swal.fire({
          icon: "success",
          text: "Sarve Master Saved Successfully.",
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
        });
        this.router.navigate(['admin/sarve-list'])
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

  editSarvemaster() {

    let obj = {
      _id: this.sarveId
    }

    this.adminLayoutService.getSarveMasterById(obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.ISeditSarveMaster = true;
        this.sarvemasterForm.controls._id.setValue(Response.data._id)
        this.sarvemasterForm.controls.name.setValue(Response.data.name)
        this.sarvemasterForm.controls.mobile.setValue(Response.data.mobile)
        this.sarvemasterForm.controls.email.setValue(Response.data.email)

        document.title = 'Sarve - ' + this.toTitleCase(Response.data.name) + ' | માપણી વાંધા અરજી'
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

  updateSarvemaster() {
    if (this.sarvemasterForm.invalid) {
      this.submittedSarveMasterData = true;
      return;
    }
    let sarvemasterObj = {
      "_id": this.sarvemasterForm.controls._id.value,
      "name": this.sarvemasterForm.controls.name.value,
      "mobile": this.sarvemasterForm.controls.mobile.value,
      "email": this.sarvemasterForm.controls.email.value,
    };

    this.adminLayoutService.UpdateSarveMaster(sarvemasterObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedSarveMasterData = false;
        this.defaultForm();
        this.ISeditSarveMaster = false;
        Swal.fire({
          icon: "success",
          text: "Sarve Master Updated Successfully.",
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
        });
        this.router.navigate(['admin/sarve-list'])
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

}
