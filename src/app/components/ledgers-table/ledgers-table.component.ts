import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { EmptyContentModel } from '../../core/interfaces/empty-content.interface';
import { emptyContentLedgersTab } from '../../core/constants/empty-content.constant';
import { TransactionActionService } from '../../core/services/state/transactions/transaction-action.service';
import { TransactionModel } from '../../core/interfaces/transaction.interface';
import * as selectors from '../../core/store/transactions/transactions.selectors';
import { takeUntil, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ITransactionsState } from '../../core/store/transactions/transactions.reducer';
import { TransactionType } from '../../core/constants/transaction.constants';
import { InvoiceActionsService } from '../../core/services/state/invoices/invoice-actions.service';

@Component({
  selector: 'app-ledgers-table',
  templateUrl: './ledgers-table.component.html',
  styleUrls: ['./ledgers-table.component.scss']
})
export class LedgersTableComponent implements OnInit, OnDestroy{
  destroy$: Subject<void> = new Subject<void>();
  @Input() dataLoaded$: Observable<boolean>;
  @Input() set setData(data: any) {
    this.dataSource.data = data;
    this.dataSource.sort = this.empTbSort;
  }
  transactions: TransactionModel[];

  @ViewChild('empTbSort') empTbSort = new MatSort();

  dataSource = new MatTableDataSource<any>();

  emptyContentLedgersTab: EmptyContentModel = emptyContentLedgersTab;
  displayedColumns: string[] = ['date', 'account', 'party', 'debit', 'credit'];

  filterValue = '';

  constructor(
    private transactionActionService: TransactionActionService,
    private invoiceActionService: InvoiceActionsService,
    private transactionStore: Store<ITransactionsState>,
  ) { }

  ngOnInit(): void {
    this.transactionStore.select(selectors.selectTransactionsData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => this.transactions = result);
  }

  openModal(element: any): void {
    const transaction = this.transactions.find(value => JSON.stringify(value).indexOf(element.id));

    switch (transaction.type) {
      case TransactionType.Bill:
        this.invoiceActionService.viewInvoice(transaction.invoice);
        break;
      case TransactionType.Invoice:
        this.invoiceActionService.viewInvoice(transaction.invoice);
        break;
      case TransactionType.Cash:
        this.transactionActionService.viewTransaction(transaction);
        break;
      case TransactionType.Expense:
        this.transactionActionService.viewExpense(transaction);
        break;
      case TransactionType.ManualLedger:
        this.transactionActionService.viewManualLedgers(transaction);
        break;
      case TransactionType.Balance:
        this.transactionActionService.viewBalance(transaction);
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
