import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { saveAs } from 'file-saver-es';
import { emptyInvoice } from '../../../constants/invoice.constants';
import { InvoiceModel } from '../../../interfaces/invoice.interface';

import {
  emptyManualLedgers,
  emptyTransaction,
  InvoiceType,
  ModalMode
} from '../../../constants/transaction.constants';
import { ModalInvoicesListComponent } from '../../../../components/modal-invoices-list/modal-invoices-list.component';
import { ModalTransactionComponent } from '../../../../components/modal-transaction/modal-transaction.component';
import {
  ManualLedgersDto,
  ModalTransactionData,
  TransactionModel
} from '../../../interfaces/transaction.interface';
import { ModalConfirmComponent } from '../../../../shared/components/modal-confirm/modal-confirm.component';
import { ModalConfirmData, ModalConfirmType } from '../../../../shared/interfaces/modal-confirm.interface';
import { selectCsvText } from '../../../store/transactions/transactions.selectors';
import { ITransactionsState } from '../../../store/transactions/transactions.reducer';
import { exportTransactions } from '../../../store/transactions/transactions.actions';
import { selectAccountsData } from '../../../store/accounts/accounts.selectors';
import { IAccountsState } from '../../../store/accounts/accounts.reducer';
import { ModalTransactionService } from './modal-transaction.service';
import { ModalInvoiceData } from '../../../interfaces/modal-invoice.interface';
import { LogService } from '../../../../shared/logger/services/log.service';
import { InvoiceActionsService } from '../invoices/invoice-actions.service';
import { ModalModeService } from '../../../../shared/services/modal-mode.service';
import { ModalInvoiceComponent } from '../../../../components/modal-invoice/modal-invoice.component';
import { ModalLedgerComponent } from '../../../../components/modal-ledger/modal-ledger.component';
import * as transactionActions from '../../../store/transactions/transactions.actions';
import * as transactionSelectors from '../../../store/transactions/transactions.selectors';
import { ModalExpenseComponent } from '../../../../components/modal-expense/modal-expense.component';

@Injectable({
  providedIn: 'root'
})
export class TransactionActionService {

  constructor(
    private dialog: MatDialog,
    private transactionStore: Store<ITransactionsState>,
    private accountsStore: Store<IAccountsState>,
    private modalTransactionService: ModalTransactionService,
    private logger: LogService,
    private invoiceActionService: InvoiceActionsService,
    private modalModeService: ModalModeService
  ) { }

  exportTransactions(subscription: Subject<any>): void {
    this.transactionStore.dispatch(exportTransactions());
    this.transactionStore.select(selectCsvText).pipe(
      takeUntil(subscription),
      filter(v => Boolean(v))
    ).subscribe((csvText: string) => {
      const blob = new Blob([csvText], { type: 'text/csv' });
      return new saveAs(blob, 'Transactions.csv');
    });
  }

  addTransaction(actionName: string): void {
    if (actionName === 'recordTransaction') {
      this.modalTransactionService.setCurrentTransaction(emptyTransaction);
      this.modalModeService.setModalMode(ModalMode.Add);
      this.openTransactionModal();
    }

    if (actionName === 'recordManualLedger') {
      this.createManualLedgers(emptyManualLedgers);
    }

    if (actionName === 'recordInvoice') {
      this.invoiceActionService.createInvoice(InvoiceType.Invoice, emptyInvoice);
    }

    if (actionName === 'recordExpense') {
      this.createExpense(emptyTransaction);
    }

    if (actionName === 'receiveBill') {
      this.invoiceActionService.createInvoice(InvoiceType.Bill, emptyInvoice);
    }

    if (actionName === 'invoicePaid') {
      this.openInvoiceListModal({
        title: 'Invoices',
        buttonName: 'Add New Invoice',
        transactionType: InvoiceType.Invoice,
        viewTransaction: (invoice: InvoiceModel) => this.invoiceActionService.viewInvoice(invoice),
        addTransaction: () => this.invoiceActionService.createInvoice(InvoiceType.Invoice, emptyInvoice)
      });
    }

    if (actionName === 'payBill') {
      this.openInvoiceListModal({
        title: 'Bills',
        buttonName: 'Add New Bill',
        transactionType: InvoiceType.Bill,
        viewTransaction: (invoice: InvoiceModel) => this.invoiceActionService.viewInvoice(invoice),
        addTransaction: () => this.invoiceActionService.createInvoice(InvoiceType.Bill, emptyInvoice)
      });
    }
  }

  editTransaction(transaction: TransactionModel): void {
    this.modalTransactionService.setCurrentTransaction(transaction);
    this.modalModeService.setModalMode(ModalMode.Edit);
    this.openTransactionModal();
  }

  viewTransaction(transaction: TransactionModel): void {
    this.modalTransactionService.setCurrentTransaction(transaction);
    this.modalModeService.setModalMode(ModalMode.View);
    this.openTransactionModal();
  }

  viewBalance(balance: TransactionModel): void {
    this.modalTransactionService.setCurrentTransaction(balance);
    this.modalModeService.setModalMode(ModalMode.View);
    this.openTransactionModal();
  }

  deleteTransaction(
    id: string,
    name: string,
    dialogRef?: MatDialogRef<ModalTransactionComponent | ModalInvoiceComponent | ModalLedgerComponent>
  ): void {
    this.dialog.open(ModalConfirmComponent, {
      height: '300px',
      width: '440px',
      autoFocus: false,
      data: {
        text: `Are you sure you want to delete this ${name}?`,
        submitName: 'Delete',
        type: ModalConfirmType.DELETE,
        spinner$: this.transactionStore.select(transactionSelectors.selectIsDeleteSpinnerStarted),
        actionSuccess$: this.transactionStore.select(transactionSelectors.selectIsDataLoadedAfterAction),
        action: () => this.transactionStore.dispatch(transactionActions.deleteTransaction({ id }))
      } as ModalConfirmData
    })
      .afterClosed()
      .pipe(take(1), filter(res => Boolean(res) && Boolean(dialogRef)))
      .subscribe(() => dialogRef.close());
  }

  openTransactionModal(): void {
    this.dialog.open(ModalTransactionComponent, {
      height: 'auto',
      width: '980px',
      position: { top: '80px' },
      data: {
        accounts$: this.accountsStore.select(selectAccountsData)
      } as ModalTransactionData
    });
  }

  openInvoiceListModal(data: ModalInvoiceData): void {
    this.dialog.open(ModalInvoicesListComponent, {
      height: '700px',
      width: '980px',
      position: { top: '80px' },
      data
    });
  }

  /** CRUD Trx Expense */
  createExpense(expense: TransactionModel): void {
    this.modalModeService.setModalMode(ModalMode.Add);
    this.modalTransactionService.setCurrentTransaction(expense);
    this.openExpenseModal();
  }

  viewExpense(expense: TransactionModel): void {
    this.modalModeService.setModalMode(ModalMode.View);
    this.modalTransactionService.setCurrentTransaction(expense);
    this.openExpenseModal();
  }

  editExpense(expense: TransactionModel): void {
    this.modalModeService.setModalMode(ModalMode.Edit);
    this.modalTransactionService.setCurrentTransaction(expense);
    this.openExpenseModal();
  }

  openExpenseModal(): void {
    this.dialog.open(ModalExpenseComponent, {
      height: 'auto',
      width: '980px',
      position: { top: '80px' },
      data: {
        accounts$: this.accountsStore.select(selectAccountsData)
      } as ModalTransactionData
    });
  }

  /** CRUD Manual Ledger */
  createManualLedgers(manualLedgersModel: ManualLedgersDto): void {
    this.modalModeService.setModalMode(ModalMode.Add);
    this.modalTransactionService.setCurrentManualLedger(manualLedgersModel);
    this.openManualLedgerModal();
  }

  viewManualLedgers(manualLedgersModel: ManualLedgersDto): void {
    this.modalModeService.setModalMode(ModalMode.View);
    this.modalTransactionService.setCurrentManualLedger(manualLedgersModel);
    this.openManualLedgerModal();
  }

  editManualLedger(row: TransactionModel): void {
    this.modalModeService.setModalMode(ModalMode.Edit);
    this.modalTransactionService.setCurrentManualLedger(row);
    this.openManualLedgerModal();
  }

  openManualLedgerModal(): void {
    this.dialog.open(ModalLedgerComponent, {
      width: '980px',
      height: 'auto',
      position: { top: '80px' }
    });
  }
}
