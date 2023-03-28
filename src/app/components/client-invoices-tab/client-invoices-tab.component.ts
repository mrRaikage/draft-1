import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { ModalMode } from '../../core/constants/transaction.constants';
import { ModalModeService } from '../../shared/services/modal-mode.service';
import { ITransactionsState } from '../../core/store/transactions/transactions.reducer';
import * as transactionSelectors from '../../core/store/transactions/transactions.selectors';
import { IClientsState } from '../../core/store/clients/clients.reducer';
import * as clientsSelectors from '../../core/store/clients/clients.selectors';
import * as clientsActions from '../../core/store/clients/clients.actions';
import { ModalClientsService } from '../../core/services/state/clients/modal-clients.service';
import { ModalClientsComponent } from '../modal-clients/modal-clients.component';
import { TransactionModel } from '../../core/interfaces/transaction.interface';
import { InvoiceActionsService } from '../../core/services/state/invoices/invoice-actions.service';
import { emptyContentInvoice } from '../../core/constants/empty-content.constant';
import { EmptyContentModel } from '../../core/interfaces/empty-content.interface';

@Component({
  selector: 'app-invoices-tab',
  templateUrl: './client-invoices-tab.component.html',
  styleUrls: ['./client-invoices-tab.component.scss']
})
export class ClientInvoicesTabComponent implements OnInit, AfterContentChecked, OnDestroy {

  @Output() closeModal = new EventEmitter();

  form: FormGroup;
  columns: string[];
  clientInvoices: TransactionModel[];
  emptyContentClientInvoice: EmptyContentModel = emptyContentInvoice;

  formControl: FormControl = this.fb.control(null);
  total = 0;

  tableFormGroupRows$ = new BehaviorSubject<FormGroup[]>(null);
  subscription$ = new Subject();
  invoicesList$: Observable<TransactionModel[]> = this.clientsStore.select(clientsSelectors.selectClientInvoices);
  invoicesIsLoading$: Observable<boolean> = this.clientsStore.select(clientsSelectors.selectIsModalDataLoading);

  get modalMode(): ModalMode {
    return this.modalModeService.getModalMode();
  }

  constructor(
    private modalModeService: ModalModeService,
    private fb: FormBuilder,
    private clientsStore: Store<IClientsState>,
    private cdr: ChangeDetectorRef,
    private invoiceActionsService: InvoiceActionsService,
    public modalClientsService: ModalClientsService,
    public dialogRef: MatDialogRef<ModalClientsComponent>,
    private transactionsStore: Store<ITransactionsState>
  ) {

    /** Get Client Invoices Data For Invoices Tab */
    this.clientsStore.dispatch(clientsActions.clientInvoices({
      clientId: this.modalClientsService.getCurrentClient().id
    }));

    this.invoicesList$.pipe(
      filter(res => Boolean(res)),
      takeUntil(this.subscription$)
    )
      .subscribe((clientInvoices: TransactionModel[]) => {
        this.clientInvoices = clientInvoices;
        this.calculateTotal(clientInvoices);
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
    this.tableFormGroupRows$.next(this.fillInvoicesGroups(this.clientInvoices));
    this.columns = ['remove', 'status', 'date', 'invoiceN', 'details', 'amount'];
  }

  fillInvoicesGroups(rows: TransactionModel[]): FormGroup[] {
    return rows.map((row: TransactionModel) => this.fb.group({
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
        const selectedInvoice: TransactionModel = trxItems.find(
          ({ invoice }: TransactionModel) => invoice.number === event.value.invoiceN
        );
        if (selectedInvoice) {
          this.invoiceActionsService.viewInvoice(selectedInvoice.invoice);
          this.dialogRef.close();
        }
      });
  }

  cancelButtonClick(): void {
      this.closeModal.emit();
  }
}
