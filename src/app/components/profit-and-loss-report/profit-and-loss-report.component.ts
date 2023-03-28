import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import * as moment from 'moment';

import { LocalStorageService } from '../../shared/services/local-storage.service';
import { IFinancialReportsState } from '../../core/store/financial-reports/financial-reports.reducer';
import * as financialReportsActions from '../../core/store/financial-reports/financial-reports.actions';
import * as financialReportsSelectors from '../../core/store/financial-reports/financial-reports.selectors';
import { ProfitLossModel } from '../../core/interfaces/financial-reports.interfaces';

@Component({
  selector: 'app-profit-and-loss-report',
  templateUrl: './profit-and-loss-report.component.html',
  styleUrls: ['./profit-and-loss-report.component.scss']
})
export class ProfitAndLossReportComponent implements OnInit, OnDestroy {
  form: FormGroup;
  fromDate: string;
  toDate: string;

  subscription$ = new Subject();
  profitLossIsLoading$: Observable<boolean> = this.financialReportsStore.select(financialReportsSelectors.selectProfitLossIsLoading);
  data$: Observable<ProfitLossModel> = this.financialReportsStore.select(financialReportsSelectors.selectProfitLossData);

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
    this.fillForm(this.lSService.getIncomeStatementPeriod());
    const from = moment(this.form.get('from').value).format('YYYY-MM-DD');
    const to = moment(this.form.get('to').value).format('YYYY-MM-DD');
    this.updateReport({ from, to });
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  updateButtonClick(): void {
    if (this.form.invalid) {
      return;
    }

    const from = moment(this.form.get('from').value).format('YYYY-MM-DD');
    const to = moment(this.form.get('to').value).format('YYYY-MM-DD');
    this.lSService.setIncomeStatementPeriod({ from, to });
    this.updateReport({ from, to });
  }

  updateReport({ from, to }): void {
    this.fromDate = moment(from).format('YYYY-MM-DD');
    this.toDate = moment(to).format('YYYY-MM-DD');
    this.financialReportsStore.dispatch(financialReportsActions.profitAndLossData({ from: this.fromDate, to: this.toDate }));
  }

  exportToPdf(): void {
    html2canvas(this.contentToConvert.nativeElement).then(canvas => {
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(`profit-report-${this.fromDate}-${this.toDate}.pdf`);
    });
  }

  fillForm({ from, to }: { from: string, to: string }): void {
    this.form = this.fb.group({
      from: new FormControl(from, [Validators.required]),
      to: new FormControl(to, [Validators.required])
    });
  }
}
