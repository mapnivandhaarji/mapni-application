import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Sort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
declare const $: any;
import Swal from "sweetalert2";


@Component({
  selector: 'app-sarve-list',
  templateUrl: './sarve-list.component.html',
  styleUrls: ['./sarve-list.component.css']
})
export class SarveListComponent implements OnInit {

  mySelect;
  noData;
  l: number;
  itemsPerPage: number
  p: number = 1;
  sarvemasterList: any[] | any;
  allsarvemaster: any[] | any;
  sarveMasterList: any[] | any;
  sarvemasterListlength: any;
  itemList = [
    { value: 30, name: '30' },
    { value: 50, name: '50' },
    { value: 100, name: '100' },
    { value: 150, name: '150' },
    { value: 200, name: '200' },
    { value: 300, name: '300' }
  ];

  constructor(public adminLayoutService: AdminLayoutService, private fb: FormBuilder, public commonService: CommonService, private router: Router) {

  }

  ngOnInit(): void {
    document.title = 'Sarve | માપણી વાંધા અરજી';
    this.noData = false;
    this.mySelect = 5;
    this.l = this.itemsPerPage = 30;
    this.getSarveMaster();
  }

  itemsPerPageChange(val: any) {
    this.l = this.itemsPerPage = parseInt(val);
    this.p = 1;
  }

  editSarvemaster(id) {
    this.router.navigate(['admin/sarve-list/sarve-update'], {
      queryParams: {
        id: id,
      }
    })
  }
  viewSarvemaster(id) {
    this.router.navigate(['admin/sarve-list/view-sarve-details'], {
      queryParams: {
        id: id,
      }
    })
  }

  statusSarvemaster(paramsObj) {

    Swal.fire({
      title:
        paramsObj.status == 1
          ? "Active"
          : paramsObj.status == 2
            ? "Deative"
            : "",
      text:
        paramsObj.status == 1
          ? "Are you sure want Active this Sarve ?"
          : paramsObj.status == 2
            ? "Are you sure want Deactive this Sarve ?"
            : "",
      icon: "warning",
      showCancelButton: true,
      //confirmButtonColor: '#3085d6',
      //cancelButtonColor: '#d33',
      confirmButtonText:
        paramsObj.status == 1
          ? "Yes, Active it."
          : paramsObj.status == 2
            ? "Yes, Deactive it."
            : "",
    }).then((result) => {
      if (result.isConfirmed) {
        let statussarvemasterModelObj = {
          _id: paramsObj.id,
          status: paramsObj.status,
        };

        this.adminLayoutService.StatusSarveMaster(statussarvemasterModelObj).subscribe(
          (Response: any) => {
            if (Response.meta.code == 200) {
              if (paramsObj.status == 1) {
                // this.commonService.notifier.notify(
                //   "success",
                //   "Menu Details Actived Successfully."
                // );
                Swal.fire({
                  icon: "success",
                  text: "Sarve Master Actived Successfully.",
                  timer: 1500,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              } else {
                // this.commonService.notifier.notify(
                //   "success",
                //   "Menu Details Deactived Successfully."
                // );
                Swal.fire({
                  icon: "success",
                  text: "Sarve Master Deactived Successfully.",
                  timer: 1500,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              }
              this.getSarveMaster();
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

  getSarveMaster() {
    this.adminLayoutService.getSarveMaster().subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.sarveMasterList = Response.data;
        this.sarvemasterList = this.sarveMasterList
        this.allsarvemaster = this.sarvemasterList
        this.sarvemasterList = this.sarveMasterList.slice();
        this.sarvemasterListlength = Response.data.length;
        this.noData = false;
      } else {
        this.noData = true;
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  search(value: any) {

    this.sarvemasterList = this.allsarvemaster.filter((val: any) => val.name.toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.sarvemasterList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  sortData(sort: Sort) {
    const data = this.allsarvemaster.slice();
    if (!sort.active || sort.direction === '') {
      this.sarvemasterList = data;
      return;
    }

    this.sarvemasterList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'name': return compare(a.name.toLowerCase(), b.name.toLowerCase(), isAsc);
        case 'email': return compare(a.email.toLowerCase(), b.email.toLowerCase(), isAsc);
        case 'mobile': return compare(a.mobile, b.mobile, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}