import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import * as financialReportsActions from '../../core/store/financial-reports/financial-reports.actions';
import * as financialReportsSelectors from '../../core/store/financial-reports/financial-reports.selectors';
import * as dashboardSelectors from '../../core/store/dashboard/dashboard.selectors';
import { IDashboardState } from '../../core/store/dashboard/dashboard.reducer';
import { IFinancialReportsState } from '../../core/store/financial-reports/financial-reports.reducer';
import { getBalanceChartSettings, revenueAndExpensesChartSettings } from '../../core/utils/chart.settings';
import { ReportItemChildModel } from '../../core/interfaces/financial-reports.interfaces';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  expensesAndRevenueChartSettings;
  balanceChartSettings;

  revenueAndExpensesChartData$ = this.dashboardStore.select(dashboardSelectors.selectRevenueAndExpensesChartData);
  balanceSheet$ = this.financialReportsStore.select(financialReportsSelectors.selectBalanceSheetData);
  subscription$ = new Subject();

  constructor(
    private dashboardStore: Store<IDashboardState>,
    private financialReportsStore: Store<IFinancialReportsState>,
    private lSService: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    this.initRevenueAndExpensesChart();
    this.initCashReservesChart();
  }

  initRevenueAndExpensesChart(): void {
    this.revenueAndExpensesChartData$.pipe(
      filter(res => Boolean(res)),
      takeUntil(this.subscription$)
    )
      .subscribe(chartData => {
        const revenue = Object.values(chartData.revenueData);
        const expenses = Object.values(chartData.expensesData);
        const month = Object.keys(chartData.revenueData);
        this.expensesAndRevenueChartSettings = revenueAndExpensesChartSettings(revenue, expenses, month, chartData.min, chartData.max);
      });
  }

  initCashReservesChart(): void {
    this.financialReportsStore.dispatch(financialReportsActions.balanceSheetData({ date: this.lSService.getBalanceReportDate() }));

    this.balanceSheet$
      .pipe(filter(res => Boolean(res)), takeUntil(this.subscription$))
      .subscribe(accounts => {
        const cashAccounts = accounts.assets.CurrentAssets.children.find(acc => acc.name === 'Cash Accounts');

        if (cashAccounts.children.length) {
          const balances = cashAccounts.children.map((account: ReportItemChildModel) => account.amount);
          const total = cashAccounts.amount;
          const series = balances;
          const labels = cashAccounts.children.map((account: ReportItemChildModel) => account.name);
          this.balanceChartSettings = getBalanceChartSettings(series, labels, total);
        } else {
          this.balanceChartSettings = null;
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }
}


