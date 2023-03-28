import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as accountsSelectors from '../../core/store/accounts/accounts.selectors';
import * as clientsSelectors from '../../core/store/clients/clients.selectors';
import { emptyInvoice } from '../../core/constants/invoice.constants';
import { InvoiceModel } from '../../core/interfaces/invoice.interface';
import * as invoicesSelectors from '../../core/store/invoices/invoices.selectors';
import { ITransactionsState } from '../../core/store/transactions/transactions.reducer';
import { InvoiceType } from '../../core/constants/transaction.constants';
import { InvoiceActionsService } from '../../core/services/state/invoices/invoice-actions.service';
import { ActionKey } from '../../shared/interfaces/actions.interface';
import { IAccountsState } from '../../core/store/accounts/accounts.reducer';
import { TransactionActionService } from '../../core/services/state/transactions/transaction-action.service';
import { IInvoicesState } from '../../core/store/invoices/invoices.reducer';
import { emptyContentCurrentInvoice } from '../../core/constants/empty-content.constant';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

  dataLoaded$: Observable<boolean> = this.invoicesStore.select(invoicesSelectors.selectIsDataLoaded);
  accounts$ = this.accountsStore.select(accountsSelectors.selectAccountsData);
  clients$ = this.clientsStore.select(clientsSelectors.selectClients);
  invoices$ = this.invoicesStore.select(invoicesSelectors.selectInvoices);
  emptyContentInvoice = emptyContentCurrentInvoice;

  constructor(
    private transactionStore: Store<ITransactionsState>,
    public invoiceActionsService: InvoiceActionsService,
    private transactionActionService: TransactionActionService,
    private accountsStore: Store<IAccountsState>,
    private clientsStore: Store<IAccountsState>,
    private invoicesStore: Store<IInvoicesState>
  ) {}

  ngOnInit(): void {
  }

  createInvoice(): void {
    this.invoiceActionsService.createInvoice(InvoiceType.Invoice, emptyInvoice);
  }

  handleAction([transactionInvoice, key]: [InvoiceModel, ActionKey | string]): void {
    switch (key) {
      case ActionKey.View: this.invoiceActionsService.viewInvoice(transactionInvoice); break;
      case ActionKey.Edit: this.invoiceActionsService.editInvoice(transactionInvoice); break;
      case ActionKey.Delete: this.invoiceActionsService.deleteInvoice(transactionInvoice.id); break;
      default: return;
    }
  }
}
