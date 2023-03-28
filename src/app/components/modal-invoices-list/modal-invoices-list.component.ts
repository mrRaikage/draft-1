import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { map, takeUntil } from 'rxjs/operators';
import { InvoiceModel } from '../../core/interfaces/invoice.interface';

import { TransactionModel } from '../../core/interfaces/transaction.interface';
import { ITransactionsState } from '../../core/store/transactions/transactions.reducer';
import { selectTransactionsData } from '../../core/store/transactions/transactions.selectors';
import { IAccountsState } from '../../core/store/accounts/accounts.reducer';
import { selectAccountsData } from '../../core/store/accounts/accounts.selectors';
import { InvoiceType, TransactionType } from '../../core/constants/transaction.constants';
import { AccountModel } from '../../core/interfaces/account.interface';
import { touchTransaction } from '../../shared/utils/functions/touch-transaction.function';
import { ModalInvoiceData } from '../../core/interfaces/modal-invoice.interface';

@Component({
  selector: 'app-modal-invoices-list',
  templateUrl: './modal-invoices-list.component.html',
  styleUrls: ['./modal-invoices-list.component.scss']
})
export class ModalInvoicesListComponent implements OnInit, OnDestroy {

  subscription$ = new Subject();

  filterValue = '';
  dataSource: MatTableDataSource<TransactionModel>;
  columns = ['number', 'description', 'date', 'dueDate', 'amount'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalInvoiceData,
    public dialogRef: MatDialogRef<ModalInvoicesListComponent>,
    private transactionStore: Store<ITransactionsState>,
    private accountsStore: Store<IAccountsState>
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.filteredTableData();
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  filteredTableData(): void {
    combineLatest([
      this.transactionStore.select(selectTransactionsData)
        .pipe(
          takeUntil(this.subscription$),
          map((transactions: TransactionModel[]) => transactions.filter((transaction: TransactionModel) => {
            if (this.data.transactionType === InvoiceType.Invoice) {
              return transaction.type === TransactionType.Invoice
                && transaction.invoice.type === InvoiceType.Invoice
                && (transaction.invoice.status === null || transaction.invoice.status === 'Approved');
            }
            if (this.data.transactionType === InvoiceType.Bill) {
              return transaction.type === TransactionType.Bill
                && transaction.invoice.type === InvoiceType.Bill
                && (transaction.invoice.status === null || transaction.invoice.status === 'Received');
            }
            return false;
          }))
        ),
      this.accountsStore.select(selectAccountsData)
    ])
    .subscribe(([filteredTransactions, accounts]: [TransactionModel[], AccountModel[]]) => {
      this.dataSource = new MatTableDataSource(
        filteredTransactions.map((transaction: TransactionModel) => touchTransaction(accounts, transaction))
      );
    });
  }

  getNumberColumnName(): InvoiceType {
    return this.data.transactionType;
  }

  applyFilter(value: string): void {
    this.filterValue = value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  clickRow(row: TransactionModel): void {
    this.dialogRef.close();
    this.data.viewTransaction(row.invoice);
  }

  addNew(): void {
    this.dialogRef.close();
    this.data.addTransaction();
  }
}
