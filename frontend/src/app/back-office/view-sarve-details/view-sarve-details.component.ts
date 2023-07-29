import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminLayoutService } from 'app/layouts/admin-layout/admin-layout.service';

@Component({
  selector: 'app-view-sarve-details',
  templateUrl: './view-sarve-details.component.html',
  styleUrls: ['./view-sarve-details.component.css']
})
export class ViewSarveDetailsComponent implements OnInit {

  sarveryerDetails: any;
  applicationDetailsList: any[] = [];
  allApplicationDetailsList: any[] = [];
  noData: boolean = false;
  sarveId: any;
  applicationDetailsListLength: number = 0;;

  constructor(private adminLayoutService: AdminLayoutService, private route: ActivatedRoute, private router: Router) {
    const url = this.router.url;

    if (url.includes('view-sarve-details')) {
      this.route.queryParams.subscribe((x: any) => {
        this.sarveId = x.id
      });

      this.getSarveyerDetails();
    }
    document.title = 'Sarveyer Details | માપણી વાંધા અરજી';
  }

  ngOnInit(): void {

  }

  getSarveyerDetails() {
    this.sarveryerDetails = '';
    this.applicationDetailsList = [];

    let obj = {
      _id: this.sarveId
    }

    this.adminLayoutService.getSarveMasterById(obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.sarveryerDetails = Response.data;
        this.getAssignApplicationList()
      }
    })
  }

  getAssignApplicationList() {
    this.applicationDetailsList = [];

    let Obj = {
      isAssign: true,
      sarveId: this.sarveId,
      applicationYear: '2023',
      applicationMonth: '02'
    }
    this.adminLayoutService.getAssignedApplicationList(Obj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.applicationDetailsList = Response.data
        this.allApplicationDetailsList = this.applicationDetailsList
        this.applicationDetailsListLength = Response.data.length;

        this.noData = false;
      } else {
        this.noData = true;

      }


      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }


  search(value) {
    this.applicationDetailsList = this.allApplicationDetailsList.filter((val: any) => val.MTRno.includes(value));
    this.applicationDetailsListLength = this.applicationDetailsList.length;
    if (this.applicationDetailsList.length == 0) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

}
