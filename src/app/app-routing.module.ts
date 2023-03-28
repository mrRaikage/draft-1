import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountsTabComponent } from './components/accounts-tab/accounts-tab.component';
import { BankFeedsComponent } from './pages/bank-feeds/bank-feeds.component';
import { InvoicingTabComponent } from './components/invoicing-tab/invoicing-tab.component';
import { OrganizationTabComponent } from './components/organization-tab/organization-tab.component';
import { ProfileTabComponent } from './components/profile-tab/profile-tab.component';
import { SettingsPricebookTabComponent } from './components/settings-pricebook-tab/settings-pricebook-tab.component';
import { UsersTabComponent } from './components/users-tab/users-tab.component';
import { ContentComponent } from './pages/content/content.component';
import { PermissionGuard } from './shared/guards/permission.guard';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { OnBoardingRequirementComponent } from './pages/onboarding-requirement/on-boarding-requirement.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { DeactivateGuard } from './shared/guards/deactivate.guard';
import { BalanceReportComponent } from './components/balance-report/balance-report.component';
import { ProfitAndLossReportComponent } from './components/profit-and-loss-report/profit-and-loss-report.component';
import { JobComponent } from './pages/job/job.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AssetComponent } from './pages/asset/asset.component';
import { LedgersPageComponent } from './pages/ledgers/ledgers.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'content/transactions',
    pathMatch: 'full'
  },
  {
    path: 'content',
    component: ContentComponent,
    canActivate: [PermissionGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'transactions',
        component: TransactionsComponent
      },
      {
        path: 'invoices',
        component: InvoicesComponent
      },
      {
        path: 'bank-feeds',
        component: BankFeedsComponent
      },
      {
        path: 'jobs',
        component: JobComponent
      },
      {
        path: 'clients',
        component: ClientsComponent
      },
      {
        path: 'asset',
        component: AssetComponent
      },
      {
        path: 'financial-reports/balance-report',
        component: BalanceReportComponent
      },
      {
        path: 'financial-reports/profit-and-loss-report',
        component: ProfitAndLossReportComponent
      },
      {
        path: 'ledgers',
        component: LedgersPageComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'profile'
          },
          {
            path: 'profile',
            component: ProfileTabComponent,
            canDeactivate: [DeactivateGuard]
          },
          {
            path: 'user',
            component: UsersTabComponent,
            canDeactivate: [DeactivateGuard]
          },
          {
            path: 'invoicing',
            component: InvoicingTabComponent,
            canDeactivate: [DeactivateGuard]
          },
          {
            path: 'accounts',
            component: AccountsTabComponent,
            canDeactivate: [DeactivateGuard]
          },
          {
            path: 'organization',
            component: OrganizationTabComponent,
            canDeactivate: [DeactivateGuard]
          },
          {
            path: 'price-book',
            component: SettingsPricebookTabComponent,
            canDeactivate: [DeactivateGuard]
          }
        ]
      },
    ]
  },
  {
    path: 'on-boarding-requirement',
    component: OnBoardingRequirementComponent,
    canActivate: [PermissionGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
