import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../back-office/dashboard/dashboard.component";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { NgxPaginationModule } from "ngx-pagination";
import { NgSelectModule } from "@ng-select/ng-select";
import { ThemeSettingComponent } from "../../back-office/theme-setting/theme-setting.component";
import { NgxMatNativeDateModule } from "@angular-material-components/datetime-picker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSortModule, } from '@angular/material/sort';
import { TooltipModule } from "ng2-tooltip-directive";
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { DirectivesModule } from "app/shared/directives/directives.module";
import { EditorModule } from '@tinymce/tinymce-angular';
import { PipeModule } from "app/shared/pipe/pipe.module";
import { SarveCreateComponent } from "app/back-office/sarve-master/sarve-create/sarve-create.component";
import { SarveListComponent } from "app/back-office/sarve-master/sarve-list/sarve-list.component";
import { ApplicationCreateComponent } from "app/back-office/application-master/application-create/application-create.component";
import { ApplicationListComponent } from "app/back-office/application-master/application-list/application-list.component";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { DateAdapter } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { AssingApplicationListComponent } from "app/back-office/assing-application-list/assing-application-list.component";
import { ViewApplicationDetailsComponent } from "app/back-office/view-application-details/view-application-details.component";
import { ViewSarveDetailsComponent } from "app/back-office/view-sarve-details/view-sarve-details.component";
import { AllApplicationListComponent } from "app/back-office/all-application-list/all-application-list.component";
import { TalukaVillageListComponent } from "app/back-office/taluka-village-list/taluka-village-list.component";


export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    TooltipModule,
    NgxPaginationModule,
    NgSelectModule,
    MatDatepickerModule,
    NgxMatNativeDateModule,
    MatNativeDateModule,
    MatSortModule,
    GooglePlaceModule,
    EditorModule,
    PipeModule
  ],
  declarations: [
    DashboardComponent,
    ThemeSettingComponent,
    SarveCreateComponent,
    SarveListComponent,
    ApplicationCreateComponent,
    ApplicationListComponent,
    AssingApplicationListComponent,
    ViewApplicationDetailsComponent,
    ViewSarveDetailsComponent,
    AllApplicationListComponent,
    TalukaVillageListComponent
  ],
  providers: [MatDatepickerModule, DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})
export class AdminLayoutModule { }
