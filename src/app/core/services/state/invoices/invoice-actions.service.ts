import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';

import * as invoiceActions from '../../../store/invoices/invoices.actions';
import * as invoiceSelectors from '../../../store/invoices/invoices.selectors';
import { ModalInvoiceService } from './modal-invoice.service';
import { ModalModeService } from '../../../../shared/services/modal-mode.service';
import { IInvoicesState } from '../../../store/invoices/invoices.reducer';
import { InvoiceType, ModalMode } from '../../../constants/transaction.constants';
import { InvoiceModel } from '../../../interfaces/invoice.interface';
import {
  ModalTransactionComponent
} from '../../../../components/modal-transaction/modal-transaction.component';
import { ModalInvoiceComponent } from '../../../../components/modal-invoice/modal-invoice.component';
import { ModalLedgerComponent } from '../../../../components/modal-ledger/modal-ledger.component';
import {
  ModalConfirmComponent
} from '../../../../shared/components/modal-confirm/modal-confirm.component';
import { ModalConfirmData, ModalConfirmType } from '../../../../shared/interfaces/modal-confirm.interface';


@Injectable({
  providedIn: 'root'
})
export class InvoiceActionsService {

  constructor(
    private dialog: MatDialog,
    private modalInvoiceService: ModalInvoiceService,
    private modalModeService: ModalModeService,
    private invoiceStore: Store<IInvoicesState>
  ) { }

  createInvoice(type: InvoiceType, invoiceModel: InvoiceModel): void {
    this.modalModeService.setModalMode(ModalMode.Add);
    this.modalInvoiceService.setInvoiceType(type);
    this.modalInvoiceService.setCurrentInvoice(invoiceModel);
    this.openInvoiceModal();
  }

  viewInvoice(invoiceModel: InvoiceModel): void {
    this.modalModeService.setModalMode(ModalMode.View);
    this.modalInvoiceService.setInvoiceType(invoiceModel.type);
    this.modalInvoiceService.setCurrentInvoice(invoiceModel);
    this.openInvoiceModal();
  }

  editInvoice(invoiceModel: InvoiceModel): void {
    this.modalModeService.setModalMode(ModalMode.Edit);
    this.modalInvoiceService.setInvoiceType(invoiceModel.type);
    this.modalInvoiceService.setCurrentInvoice(invoiceModel);
    this.openInvoiceModal();
  }

  deleteInvoice(
    id: string,
    dialogRef?: MatDialogRef<ModalTransactionComponent | ModalInvoiceComponent | ModalLedgerComponent>
  ): void {
    this.dialog.open(ModalConfirmComponent, {
      height: '300px',
      width: '440px',
      autoFocus: false,
      data: {
        text: `Are you sure you want to delete this invoice?`,
        submitName: 'Delete',
        type: ModalConfirmType.DELETE,
        spinner$: this.invoiceStore.select(invoiceSelectors.selectIsDeleteInvoiceSpinnerStarted),
        actionSuccess$: this.invoiceStore.select(invoiceSelectors.selectIsDataLoadedAfterAction),
        action: () => this.invoiceStore.dispatch(invoiceActions.deleteInvoice({ id }))
      } as ModalConfirmData
    })
      .afterClosed()
      .pipe(take(1), filter(res => Boolean(res) && Boolean(dialogRef)))
      .subscribe(() => dialogRef.close());
  }

  openInvoiceModal(): void {
    this.dialog.open(ModalInvoiceComponent, {
      width: '980px',
      height: 'auto',
      position: { top: '80px' }
    });
  }
}
