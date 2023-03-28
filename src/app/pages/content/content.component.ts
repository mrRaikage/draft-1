import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { JwtHelperService } from '@auth0/angular-jwt';

import { IBankFeedsState } from '../../core/store/bank-feeds/bank-feeds.reducer';
import { IDashboardState } from '../../core/store/dashboard/dashboard.reducer';
import { IInvoicesState } from '../../core/store/invoices/invoices.reducer';
import { ModalFeedbackComponent } from '../../shared/components/modal-feedback/modal-feedback.component';
import { ITransactionsState } from '../../core/store/transactions/transactions.reducer';
import { IAccountsState } from '../../core/store/accounts/accounts.reducer';
import { IOrganizationsState } from '../../core/store/organizations/organizations.reducer';
import { IFinancialReportsState } from '../../core/store/financial-reports/financial-reports.reducer';
import * as transactionsActions from '../../core/store/transactions/transactions.actions';
import * as accountsActions from '../../core/store/accounts/accounts.actions';
import * as orgActions from '../../core/store/organizations/organizations.actions';
import * as jobActions from '../../core/store/job/job.actions';
import * as clientsActions from '../../core/store/clients/clients.actions';
import * as assetActions from '../../core/store/asset/asset.actions';
import * as bankFeedsActions from '../../core/store/bank-feeds/bank-feeds.actions';
import * as invoicesActions from '../../core/store/invoices/invoices.actions';
import * as dashboardActions from '../../core/store/dashboard/dashboard.actions';
import * as finReportsActions from '../../core/store/financial-reports/financial-reports.actions';
import { IJobsState } from '../../core/store/job/job.reducer';
import { IAssetState } from '../../core/store/asset/asset.reducer';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { FinancialReportsService } from '../../core/services/state/financial-reports/financial-reports.service';
import { LogService } from '../../shared/logger/services/log.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {
  jwtHelper = new JwtHelperService();
  isToggle = true;

  constructor(
    private lSService: LocalStorageService,
    private finReportsService: FinancialReportsService,
    private dialog: MatDialog,
    private transactionStore: Store<ITransactionsState>,
    private accountsStore: Store<IAccountsState>,
    private orgStore: Store<IOrganizationsState>,
    private financialReportsStore: Store<IFinancialReportsState>,
    private jobStore: Store<IJobsState>,
    private assetStore: Store<IAssetState>,
    private bankFeedsStore: Store<IBankFeedsState>,
    private invoicesStore: Store<IInvoicesState>,
    private dashboardStore: Store<IDashboardState>,
    private logger: LogService,
    private authService: AuthService
  ) {

    this.checkTokenExpired();
    /** This Actions must match with actions after token refresh and change Org */
    this.transactionStore.dispatch(transactionsActions.transactionsData());
    this.accountsStore.dispatch(accountsActions.accountsData({}));
    this.orgStore.dispatch(orgActions.organizationsData({}));
    this.orgStore.dispatch(orgActions.organizationSettings());
    this.orgStore.dispatch(clientsActions.clients());
    this.dashboardStore.dispatch(dashboardActions.revenueAndExpensesChartData());
    this.jobStore.dispatch(jobActions.jobsData());
    this.assetStore.dispatch(assetActions.assetData());
    this.bankFeedsStore.dispatch(bankFeedsActions.getBankFeeds());
    this.invoicesStore.dispatch(invoicesActions.invoicesData());

    this.finReportsService.setReportsDataToLS();
    this.financialReportsStore.dispatch(finReportsActions.balanceSheetData({ date: this.lSService.getBalanceReportDate() }));
    this.financialReportsStore.dispatch(finReportsActions.profitAndLossData(this.lSService.getIncomeStatementPeriod()));
  }

  openDialog(): void {
    this.dialog.open(ModalFeedbackComponent, {
      height: '600px',
      width: '800px'
    });
  }

  toggle(): void {
    this.isToggle = !this.isToggle;
  }

  checkTokenExpired(): void {
    window.onfocus = () => {
      const token = this.lSService.getToken();
      const tokenExpired = this.jwtHelper.isTokenExpired(token);

      if (tokenExpired) {
        this.logger.log('JWT Token Expired');
        this.authService.logout();
      }
    };
  }
}
