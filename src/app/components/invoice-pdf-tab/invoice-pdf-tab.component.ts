import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import {MatDialogRef} from '@angular/material/dialog';

import {ModalInvoiceComponent} from '../modal-invoice/modal-invoice.component';
import * as invoicesSelectors from '../../core/store/invoices/invoices.selectors';
import * as invoicesActions from '../../core/store/invoices/invoices.actions';
import { IInvoicesState } from '../../core/store/invoices/invoices.reducer';
import { ModalInvoiceService } from '../../core/services/state/invoices/modal-invoice.service';

@Component({
  selector: 'app-invoice-pdf-tab',
  templateUrl: './invoice-pdf-tab.component.html',
  styleUrls: ['./invoice-pdf-tab.component.scss']
})
export class InvoicePdfTabComponent implements OnInit {
  url: string;

  isPdfDataLoading$ = this.invoicesStore.select(invoicesSelectors.selectIsPdfLoading);

  constructor(
    private invoicesStore: Store<IInvoicesState>,
    private modalInvoiceService: ModalInvoiceService,
    public dialogRef: MatDialogRef<ModalInvoiceComponent>
  ) { }

  ngOnInit(): void {
    const transactionId = this.modalInvoiceService.getCurrentInvoice().id;
    this.invoicesStore.dispatch(invoicesActions.downloadInvoice({ transactionId }));
    this.invoicesStore.select(invoicesSelectors.selectDownloadedInvoicePdf)
      .pipe(filter(res => Boolean(res)), take(1))
      .subscribe((url: string) => this.url = url);
  }

  downloadButtonClick(): void {
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.setAttribute('href', this.url);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

    cancelButtonClick(): void {
      this.dialogRef.close();
    }
}
