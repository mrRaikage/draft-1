import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, map, takeUntil } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { ITransactionsState } from '../../core/store/transactions/transactions.reducer';

import { ModalMode } from '../../core/constants/transaction.constants';
import { ModalModeService } from '../../shared/services/modal-mode.service';
import * as transactionSelectors from '../../core/store/transactions/transactions.selectors';
import { ModalJobService } from '../../core/services/state/job/modal-job.service';
import { TransactionModel } from '../../core/interfaces/transaction.interface';
import { InvoiceActionsService } from '../../core/services/state/invoices/invoice-actions.service';
import { ModalJobComponent } from '../modal-job/modal-job.component';
import { emptyContentInvoice } from '../../core/constants/empty-content.constant';
import { EmptyContentModel } from '../../core/interfaces/empty-content.interface';

@Component({
  selector: 'app-job-invoices-tab',
  templateUrl: './job-invoices-tab.component.html',
  styleUrls: ['./job-invoices-tab.component.scss']
})
export class JobInvoicesTabComponent implements OnInit, AfterContentChecked, OnDestroy {

  @Output() closeModal = new EventEmitter();
  total = 0;
  columns: string[];
  jobInvoices: TransactionModel[];
  currentJob = this.modalJobsService.getCurrentJob();
  emptyContentInvoice: EmptyContentModel = emptyContentInvoice;

  tableFormGroupRows$ = new BehaviorSubject(null);
  subscription$ = new Subject();
  invoicesList$: Observable<TransactionModel[]> = this.transactionsStore.select(transactionSelectors.selectTransactionsData);

  get modalMode(): ModalMode {
    return this.modalModeService.getModalMode();
  }

  constructor(
    private modalModeService: ModalModeService,
    private transactionsStore: Store<ITransactionsState>,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private invoiceActionsService: InvoiceActionsService,
    private dialogRef: MatDialogRef<ModalJobComponent>,
    public modalJobsService: ModalJobService
  ) {
    this.invoicesList$.pipe(
      filter(res => Boolean(res)),
      map((trxItems: TransactionModel[]) => {
        return trxItems.filter((item: TransactionModel) => item.invoice.jobId === this.currentJob.id);
      }),
      takeUntil(this.subscription$)
    )
      .subscribe((jobInvoices: TransactionModel[]) => {
        this.jobInvoices = jobInvoices;
        this.calculateTotal(jobInvoices);
        this.setTableData();
      });
  }

  ngOnInit(): void {}

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  setTableData(): void {
    this.tableFormGroupRows$.next(this.fillInvoicesGroup(this.jobInvoices));
    this.columns = ['remove', 'status', 'date', 'invoiceN', 'details', 'amount'];
  }

  fillInvoicesGroup(rows: TransactionModel[]): FormGroup[] {
    return rows.filter((row: TransactionModel) => row.direction === 'Sent')
      .map((row: TransactionModel) => this.fb.group({
        status: new FormControl(row.invoice.status, [Validators.required]),
        date: new FormControl(row.date, [Validators.required]),
        invoiceN: new FormControl(row.invoice.number, [Validators.required]),
        details: new FormControl(row.details, [Validators.required]),
        amount: new FormControl(row.amount, [Validators.required])
      }));
  }

  calculateTotal(lines: TransactionModel[]): void {
    let total = 0;
    lines.forEach((line: TransactionModel) => {
      total += Number(line.amount);
    });
    this.total = total;
  }

  clickOnRow(event: FormGroup): void {
    this.transactionsStore.select(transactionSelectors.selectTransactionsData)
      .pipe(takeUntil(this.subscription$), filter(res => Boolean(res)))
      .subscribe((trxItems: TransactionModel[]) => {
        const selected = trxItems.find(item => item.invoice.number === event.value.invoiceN);
        if (selected) {
          this.invoiceActionsService.viewInvoice(selected.invoice);
          this.dialogRef.close();
        }
      });
  }

  cancelButtonClick(): void {
    this.dialogRef.close();
  }
}
