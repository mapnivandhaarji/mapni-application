import { Routes } from '@angular/router';
import { ThemeSettingComponent } from '../../back-office/theme-setting/theme-setting.component';

import { DashboardComponent } from '../../back-office/dashboard/dashboard.component';
import { SarveCreateComponent } from 'app/back-office/sarve-master/sarve-create/sarve-create.component';
import { SarveListComponent } from 'app/back-office/sarve-master/sarve-list/sarve-list.component';
import { ApplicationCreateComponent } from 'app/back-office/application-master/application-create/application-create.component';
import { ApplicationListComponent } from 'app/back-office/application-master/application-list/application-list.component';
import { AssingApplicationListComponent } from 'app/back-office/assing-application-list/assing-application-list.component';
import { ViewApplicationDetailsComponent } from 'app/back-office/view-application-details/view-application-details.component';
import { ViewSarveDetailsComponent } from 'app/back-office/view-sarve-details/view-sarve-details.component';
import { AllApplicationListComponent } from 'app/back-office/all-application-list/all-application-list.component';
import { TalukaVillageListComponent } from 'app/back-office/taluka-village-list/taluka-village-list.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'developer/theme-setting', component: ThemeSettingComponent },
    { path: 'sarve-list/sarve-create', component: SarveCreateComponent },
    { path: 'sarve-list/sarve-update', component: SarveCreateComponent },
    { path: 'sarve-list', component: SarveListComponent },
    { path: 'all-application-List', component: AllApplicationListComponent },
    { path: 'application-list/application-create', component: ApplicationCreateComponent },
    { path: 'application-list/application-update', component: ApplicationCreateComponent },
    { path: 'assign-application-list/application-update', component: ApplicationCreateComponent },
    { path: 'application-list', component: ApplicationListComponent },
    { path: 'taluka-village-list', component: TalukaVillageListComponent },
    { path: 'assign-application-list', component: AssingApplicationListComponent },
    { path: 'assign-application-list/view-application-details', component: ViewApplicationDetailsComponent },
    { path: 'sarve-list/view-sarve-details', component: ViewSarveDetailsComponent },

];
