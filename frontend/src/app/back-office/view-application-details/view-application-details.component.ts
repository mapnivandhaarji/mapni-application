import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminLayoutService } from 'app/layouts/admin-layout/admin-layout.service';

@Component({
  selector: 'app-view-application-details',
  templateUrl: './view-application-details.component.html',
  styleUrls: ['./view-application-details.component.css']
})
export class ViewApplicationDetailsComponent implements OnInit {

  assignApplicationList: any;
  assignableSarveyerList: any[] = [];
  noData: boolean = false;
  applicationId: any;

  constructor(private route: ActivatedRoute, private adminLayoutService: AdminLayoutService, private router: Router) {
    document.title = 'View Application Details | માપણી વાંધા અરજી';
    const url = this.router.url;
    if (url.includes('view-application-details')) {
      this.route.queryParams.subscribe((x: any) => {
        this.applicationId = x.id;
      })
    }
  }

  ngOnInit(): void {
    this.getAssignApplicationList()
  }


  getAssignApplicationList() {
    this.assignableSarveyerList = [];
    let Obj = {
      applicationId: this.applicationId
    }

    this.adminLayoutService.getApplicationMasterById({ _id: this.applicationId }).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.assignApplicationList = Response.data;
      }
    })

    this.adminLayoutService.getSarveyerDetailsByApplicationId(Obj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.assignableSarveyerList = Response.data
      } else {
      }
      //for select sub industry step
    }, (error) => {
      console.log(error.error.Message);
    });
  }

}
