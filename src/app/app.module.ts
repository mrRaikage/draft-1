import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AngularFireModule } from '@angular/fire';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { BankFeedsEffects } from './core/store/bank-feeds/bank-feeds.effects';
import { bankFeedsReducer } from './core/store/bank-feeds/bank-feeds.reducer';
import { DashboardEffects } from './core/store/dashboard/dashboard.effects';
import { dashboardReducer } from './core/store/dashboard/dashboard.reducer';
import { InvoicesEffects } from './core/store/invoices/invoices.effects';
import { invoicesReducer } from './core/store/invoices/invoices.reducer';
import { SharedModule } from './shared/shared.module';
import { environment } from '../environments/environment';
import { authReducer } from './auth/store/auth.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { transactionsReducer } from './core/store/transactions/transactions.reducer';
import { TransactionsEffects } from './core/store/transactions/transactions.effects';
import { organizationsReducer } from './core/store/organizations/organizations.reducer';
import { OrganizationsEffects } from './core/store/organizations/organizations.effects';
import { accountsReducer } from './core/store/accounts/accounts.reducer';
import { AccountsEffects } from './core/store/accounts/accounts.effects';
import { LogService } from './shared/logger/services/log.service';
import { LogPublishersService } from './shared/logger/services/log-publishers.service';
import { DeactivateGuard } from './shared/guards/deactivate.guard';
import { ApplicationInsightsErrorHandler } from './shared/services/application-insights-error-handler.service';
import { financialReportsReducer } from './core/store/financial-reports/financial-reports.reducer';
import { FinancialReportsEffects } from './core/store/financial-reports/financial-reports.effects';
import { jobReducer } from './core/store/job/job.reducer';
import { clientsReducer } from './core/store/clients/clients.reducer';
import { JobEffects } from './core/store/job/job.effects';
import { ClientsEffects } from './core/store/clients/clients.effects';
import { priceBookReducer } from './core/store/prce-book/price-book.reducer';
import { PriceBookEffects } from './core/store/prce-book/price-book.effects';
import { AssetEffects } from './core/store/asset/asset.effects';
import { assetReducer } from './core/store/asset/asset.reducer';
import { ledgerReducer } from './core/store/ledgers/ledgers.reducer';
import { LedgersEffects } from './core/store/ledgers/ledgers.effects';
import { AccountsTabComponent } from './components/accounts-tab/accounts-tab.component';
import { AccountsTableComponent } from './components/accounts-table/accounts-table.component';
import { ModalAccountComponent } from './components/modal-account/modal-account.component';
import { dateFormat } from './core/constants/date-format.constant';
import { SettingsComponent } from './pages/settings/settings.component';
import { ProfileTabComponent } from './components/profile-tab/profile-tab.component';
import { OrganizationTabComponent } from './components/organization-tab/organization-tab.component';
import { InvoicingTabComponent } from './components/invoicing-tab/invoicing-tab.component';
import { UsersTabComponent } from './components/users-tab/users-tab.component';
import {
  SettingsPricebookTabComponent
} from './components/settings-pricebook-tab/settings-pricebook-tab.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssetComponent } from './pages/asset/asset.component';
import { AssetTableComponent } from './components/asset-table/asset-table.component';
import { ModalAssetComponent } from './components/modal-asset/modal-asset.component';
import { AssetTabComponent } from './components/asset-tab/asset-tab.component';
import { BankFeedsComponent } from './pages/bank-feeds/bank-feeds.component';
import { BankFeedsTableComponent } from './components/bank-feeds-table/bank-feeds-table.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ModalClientsComponent } from './components/modal-clients/modal-clients.component';
import { ClientsTabComponent } from './components/clients-tab/clients-tab.component';
import { ClientCardComponent } from './components/client-card/client-card.component';
import { PriceBookTabComponent } from './components/price-book-tab/price-book-tab.component';
import { JobsTabComponent } from './components/jobs-tab/jobs-tab.component';
import {
  ClientInvoicesTabComponent
} from './components/client-invoices-tab/client-invoices-tab.component';
import { ClientsActionsService } from './core/services/state/clients/clients-actions.service';
import { ModalClientsService } from './core/services/state/clients/modal-clients.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChartComponent } from './components/chart/chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BalanceReportComponent } from './components/balance-report/balance-report.component';
import {
  ProfitAndLossReportComponent
} from './components/profit-and-loss-report/profit-and-loss-report.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { InvoicesTableComponent } from './components/invoices-table/invoices-table.component';
import { InvoiceTabComponent } from './components/invoice-tab/invoice-tab.component';
import {
  InvoiceLedgerItemsTabComponent
} from './components/invoice-ledger-items-tab/invoice-ledger-items-tab.component';
import { ModalInvoiceComponent } from './components/modal-invoice/modal-invoice.component';
import {
  InvoicePdfTabComponent
} from './components/invoice-pdf-tab/invoice-pdf-tab.component';
import { JobComponent } from './pages/job/job.component';
import { ModalJobComponent } from './components/modal-job/modal-job.component';
import { JobTabComponent } from './components/job-tab/job-tab.component';
import { JobCardComponent } from './components/job-card/job-card.component';
import { ChargesTabComponent } from './components/charges-tab/charges-tab.component';
import { JobInvoicesTabComponent } from './components/job-invoices-tab/job-invoices-tab.component';
import { JobApiService } from './core/services/api/job-api.service';
import { JobActionsService } from './core/services/state/job/job-actions.service';
import { ModalJobService } from './core/services/state/job/modal-job.service';
import { OrganizationsApiService } from './core/services/api/organizations-api.service';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import {
  MobileTransactionsListComponent
} from './components/mobile-transactions-list/mobile-transactions-list.component';
import {
  TransactionsTableComponent
} from './components/transactions-table/transactions-table.component';
import { NestedTableComponent } from './components/nested-table/nested-table.component';
import {
  ModalTransactionComponent
} from './components/modal-transaction/modal-transaction.component';
import { TrxTabComponent } from './components/trx-tab/trx-tab.component';
import { TrxLedgerTabComponent } from './components/trx-ledger-tab/trx-ledger-tab.component';
import {
  ModalInvoicesListComponent
} from './components/modal-invoices-list/modal-invoices-list.component';
import {
  ModalImportTransactionsComponent
} from './components/modal-import-transactions/modal-import-transactions.component';
import { ManualLedgerTabComponent } from './components/manual-ledger-tab/manual-ledger-tab.component';
import { ModalLedgerComponent } from './components/modal-ledger/modal-ledger.component';
import { ModalExpenseComponent } from './components/modal-expense/modal-expense.component';
import { ExpenseTabComponent } from './components/expense-tab/expense-tab.component';
import { TransactionsApiService } from './core/services/api/transactions-api.service';
import { OnBoardingRequirementComponent } from './pages/onboarding-requirement/on-boarding-requirement.component';
import { ContentComponent } from './pages/content/content.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LedgersTableComponent } from './components/ledgers-table/ledgers-table.component';
import { LedgersPageComponent } from './pages/ledgers/ledgers.component';

const reducers = {
  dashboard: dashboardReducer,
  auth: authReducer,
  transactions: transactionsReducer,
  organizations: organizationsReducer,
  clients: clientsReducer,
  accounts: accountsReducer,
  financialReports: financialReportsReducer,
  jobs: jobReducer,
  priceBook: priceBookReducer,
  asset: assetReducer,
  bankFeeds: bankFeedsReducer,
  invoices: invoicesReducer,
  ledgers: ledgerReducer
};

const effects = [
  DashboardEffects,
  AuthEffects,
  TransactionsEffects,
  OrganizationsEffects,
  AccountsEffects,
  FinancialReportsEffects,
  JobEffects,
  ClientsEffects,
  PriceBookEffects,
  AssetEffects,
  BankFeedsEffects,
  InvoicesEffects,
  LedgersEffects
];

const components = [
  AppComponent,
  AccountsTabComponent,
  AccountsTableComponent,
  ModalAccountComponent,
  SettingsComponent,
  ProfileTabComponent,
  OrganizationTabComponent,
  InvoicingTabComponent,
  UsersTabComponent,
  SettingsPricebookTabComponent,
  AssetComponent,
  AssetTableComponent,
  ModalAssetComponent,
  AssetTabComponent,
  BankFeedsComponent,
  BankFeedsTableComponent,
  ClientsComponent,
  ModalClientsComponent,
  ClientsTabComponent,
  ClientCardComponent,
  PriceBookTabComponent,
  JobsTabComponent,
  ClientInvoicesTabComponent,
  DashboardComponent,
  ChartComponent,
  BalanceReportComponent,
  ProfitAndLossReportComponent,
  InvoicesComponent,
  InvoicesTableComponent,
  InvoiceTabComponent,
  InvoiceLedgerItemsTabComponent,
  ModalInvoiceComponent,
  InvoicePdfTabComponent,
  JobComponent,
  ModalJobComponent,
  JobTabComponent,
  JobCardComponent,
  ChargesTabComponent,
  JobInvoicesTabComponent,
  TransactionsComponent,
  MobileTransactionsListComponent,
  TransactionsTableComponent,
  NestedTableComponent,
  ModalTransactionComponent,
  TrxTabComponent,
  TrxLedgerTabComponent,
  ModalInvoicesListComponent,
  ModalImportTransactionsComponent,
  ManualLedgerTabComponent,
  ModalLedgerComponent,
  ModalExpenseComponent,
  ExpenseTabComponent,
  OnBoardingRequirementComponent,
  ContentComponent,
  SideBarComponent,
  FooterComponent,
  LedgersPageComponent,
  LedgersTableComponent
];

const services = [
  LogService,
  LogPublishersService,
  ClientsActionsService,
  ModalClientsService,
  JobApiService,
  JobActionsService,
  ModalJobService,
  OrganizationsApiService,
  TransactionsApiService,
];

const matModules = [
  MatSidenavModule,
  MatMenuModule,
  MatPaginatorModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatDialogModule,
  MatTabsModule,
  MatCardModule,
  MatRadioModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatSelectModule,
];

/** @ts-ignore */
@NgModule({
  declarations: [...components],
  imports: [
    ...matModules,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
    HttpClientModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireAnalyticsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    ReactiveFormsModule,
    NgApexchartsModule,
    CommonModule,
    FormsModule,
  ],
  providers: [
    ...services,
    DeactivateGuard,
    CurrencyPipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: dateFormat
    },
    {
      provide: ErrorHandler,
      useClass: ApplicationInsightsErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
