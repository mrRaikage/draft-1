import { Component, Input, OnInit } from '@angular/core';

import { TransactionModel } from '../../core/interfaces/transaction.interface';
import { TransactionActionService } from '../../core/services/state/transactions/transaction-action.service';
import { TransactionType } from '../../core/constants/transaction.constants';
import { InvoiceActionsService } from '../../core/services/state/invoices/invoice-actions.service';

@Component({
  selector: 'app-nested-table',
  templateUrl: './nested-table.component.html',
  styleUrls: ['./nested-table.component.scss']
})
export class NestedTableComponent implements OnInit {
  @Input() transaction: TransactionModel;
  @Input() columnsData: { [key: string]: string };

  columns: string[];

  constructor(
    private transactionActionService: TransactionActionService,
    private invoiceActionService: InvoiceActionsService
  ) {}

  ngOnInit(): void {
    this.columns = Object.keys(this.columnsData);
  }

  getColumnName(column: string): string {
    return this.columnsData[column];
  }

  view(): void {
    switch (this.transaction.type) {
      case TransactionType.Bill:
        return this.invoiceActionService.viewInvoice(this.transaction.invoice);
        break;
      case TransactionType.Invoice:
        return this.invoiceActionService.viewInvoice(this.transaction.invoice);
        break;
      case TransactionType.Cash:
        return this.transactionActionService.viewTransaction(this.transaction);
        break;
      case TransactionType.Expense:
        return this.transactionActionService.viewExpense(this.transaction);
        break;
      case TransactionType.ManualLedger:
        return this.transactionActionService.viewManualLedgers(this.transaction);
        break;
      case TransactionType.Balance:
        return this.transactionActionService.viewBalance(this.transaction);
        break;
    }
  }

  getViewButtonName(): string {
    switch (this.transaction.type) {
      case TransactionType.Cash:
        return 'View Transaction';
        break;
      case TransactionType.Invoice:
        return 'View Invoice';
        break;
      case TransactionType.Bill:
        return 'View Bill';
        break;
      case TransactionType.ManualLedger:
        return 'View Manual Ledgers';
        break;
      case TransactionType.Expense:
        return 'View Expense';
        break;
      case TransactionType.Balance:
        return 'View Balance';
        break;
      default:
        return '';
    }
  }
}
