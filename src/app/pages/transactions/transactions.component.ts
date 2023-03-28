import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ITransactionsState } from '../../core/store/transactions/transactions.reducer';
import * as selectors from '../../core/store/transactions/transactions.selectors';
import { TransactionModel } from '../../core/interfaces/transaction.interface';
import { tableColumnsData, TransactionType } from '../../core/constants/transaction.constants';
import { IOrganizationsState } from '../../core/store/organizations/organizations.reducer';
import { Action, ActionKey } from '../../shared/interfaces/actions.interface';
import { actionsList } from '../../shared/constants/actions.constants';
import { TransactionActionService } from '../../core/services/state/transactions/transaction-action.service';
import { IAccountsState } from '../../core/store/accounts/accounts.reducer';
import { selectAccountsData } from '../../core/store/accounts/accounts.selectors';
import { transactionsData } from '../../core/store/transactions/transactions.actions';
import { InvoiceActionsService } from '../../core/services/state/invoices/invoice-actions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit, OnDestroy{
  subscription$ = new Subject();
  accounts$ = this.accountsStore.select(selectAccountsData);
  transactions$: Observable<TransactionModel[]> = this.transactionStore.select(selectors.selectTransactionsData)
    .pipe(tap((transactions: TransactionModel[]) => {
      if (!transactions) {
        this.transactionStore.dispatch(transactionsData());
      }
    }));

  tableColumnsData: { [key: string]: string } = tableColumnsData;
  dataLoaded$: Observable<boolean> = this.transactionStore.select(selectors.selectIsDataLoaded);
  transactionsActions: Action[] = actionsList.filter((action: Action) => action.key !== ActionKey.View);

  constructor(
    private transactionStore: Store<ITransactionsState>,
    private organizationsStore: Store<IOrganizationsState>,
    private accountsStore: Store<IAccountsState>,
    public dialog: MatDialog,
    public transactionActionService: TransactionActionService,
    private invoiceActionService: InvoiceActionsService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }

  handleAction([row, key]: [TransactionModel, ActionKey]) {
    switch (key) {
      case ActionKey.Edit:
        switch (row.type) {
          case TransactionType.Cash :
            this.transactionActionService.editTransaction(row);
            break;
          case TransactionType.ManualLedger:
            this.transactionActionService.editManualLedger(row);
            break;
          case TransactionType.Expense :
            this.transactionActionService.editExpense(row);
            break;
          case TransactionType.Invoice || TransactionType.Bill :
            this.invoiceActionService.editInvoice(row.invoice);
            break;
          default:
            return;
        }
        break;
      case ActionKey.Delete:
        this.transactionActionService.deleteTransaction(row.id, 'transaction');
        break;
      default:
        break;
    }
  }

  exportToCsv() {
    this.transactionActionService.exportTransactions(this.subscription$);
  }
}

