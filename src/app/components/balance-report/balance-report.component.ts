import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { filter, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

import { LocalStorageService } from '../../shared/services/local-storage.service';
import { IFinancialReportsState } from '../../core/store/financial-reports/financial-reports.reducer';
import * as financialReportsSelectors from '../../core/store/financial-reports/financial-reports.selectors';
import { BalanceSheetModel, EquityItemModel, ReportItemModel } from '../../core/interfaces/financial-reports.interfaces';
import * as financialReportsActions from '../../core/store/financial-reports/financial-reports.actions';

@Component({
  selector: 'app-balance-report',
  templateUrl: './balance-report.component.html',
  styleUrls: ['./balance-report.component.scss']
})
export class BalanceReportComponent implements OnInit, OnDestroy {
  form: FormGroup;
  date: string;

  accountsReceivable: ReportItemModel;
  currentAssets: ReportItemModel;
  fixedAssets: ReportItemModel;
  totalAssets: number;

  currentLiabilities: ReportItemModel;
  nonCurrentLiabilities: ReportItemModel;
  totalLiabilities: number;

  lessDrawings: EquityItemModel;
  netProfit: EquityItemModel;
  ownersEquity: EquityItemModel;
  equityAmount: number;

  totalLiabilitiesEquity: number;

  subscription$ = new Subject();
  balanceSheetIsLoading$: Observable<boolean> = this.financialReportsStore.select(financialReportsSelectors.selectBalanceSheetIsLoading);

  @ViewChild('contentToConvert') contentToConvert: ElementRef;

  get currentOrg(): string {
    return this.lSService.getCurrentOrg().name;
  }

  constructor(
    private lSService: LocalStorageService,
    private fb: FormBuilder,
    private financialReportsStore: Store<IFinancialReportsState>
  ) { }

  ngOnInit(): void {
    this.fillForm(this.lSService.getBalanceReportDate());
    const date = moment(this.form.get('date').value).format('YYYY-MM-DD');
    this.updateReport(date);
    this.financialReportsStore.select(financialReportsSelectors.selectBalanceSheetData)
      .pipe(filter(res => Boolean(res)), takeUntil(this.subscription$))
      .subscribe((data: BalanceSheetModel) => this.fillBalanceSheetData(data));
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  fillBalanceSheetData(data: BalanceSheetModel): void {
    /** Assets */
    if (data.assets.AccountsReceivable) {
      this.accountsReceivable = {
        children: data.assets.AccountsReceivable.children,
        amount: data.assets.AccountsReceivable.amount
      };
    }
    if (data.assets.CurrentAssets) {
      this.currentAssets = {
        children: data.assets.CurrentAssets.children,
        amount: data.assets.CurrentAssets.amount
      };
    }
    if (data.assets.FixedAssets) {
      this.fixedAssets = {
        children: data.assets.FixedAssets.children,
        amount: data.assets.FixedAssets.amount
      };
    }

    this.totalAssets = data.assets.amount;

    /** Liabilities */
    if (data.liabilities.CurrentLiabilities) {
      this.currentLiabilities = {
        children: data.liabilities.CurrentLiabilities.children,
        amount: data.liabilities.CurrentLiabilities.amount
      };
    }
    if (data.liabilities.NonCurrentLiabilities) {
      this.nonCurrentLiabilities = {
        children: data.liabilities.NonCurrentLiabilities.children,
        amount: data.liabilities.NonCurrentLiabilities.amount
      };
    }

    this.totalLiabilities = data.liabilities.amount;

    /** Equity */
    if (data.equity.OwnersEquity) {
      this.ownersEquity = {
        name: 'Owners Equity',
        amount: data.equity.OwnersEquity.amount
      };
    }
    if (data.equity.LessDrawings) {
      this.lessDrawings = {
        name: 'Less: Drawings',
        amount: data.equity.LessDrawings.amount
      };
    }
    if (data.equity.NetProfit) {
      this.netProfit = {
        name: 'Net Profit',
        amount: data.equity.NetProfit.amount
      };
    }
    this.equityAmount = data.equity.amount;

    /** Liabilities Equity */
    this.totalLiabilitiesEquity = data.liabilitiesEquity.amount;
  }

  updateButtonClick(): void {
    if (this.form.invalid) {
      return;
    }
    const date = moment(this.form.get('date').value).format('YYYY-MM-DD');
    this.lSService.setBalanceReportDate({ date });
    this.updateReport(date);
  }

  updateReport(date: string ): void {
    this.date = date;
    this.financialReportsStore.dispatch(financialReportsActions.balanceSheetData({ date }));
  }

  exportToPdf(): void {
    html2canvas(this.contentToConvert.nativeElement).then(canvas => {
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(`balance-report-${moment(this.form.get('date').value).format('YYYY-MM-DD')}.pdf`);
    });
  }

  fillForm(date: string): void {
    this.form = this.fb.group({
      date: new FormControl(date, [Validators.required])
    });
  }
}
