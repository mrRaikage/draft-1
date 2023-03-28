import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import * as invoicesSelectors from '../../core/store/invoices/invoices.selectors';
import * as invoicesActions from '../../core/store/invoices/invoices.actions';
import { ModalMode } from '../../core/constants/transaction.constants';
import { ModalInvoiceService } from '../../core/services/state/invoices/modal-invoice.service';
import { ModalModeService } from '../../shared/services/modal-mode.service';
import { IInvoicesState } from '../../core/store/invoices/invoices.reducer';

@Component({
  selector: 'app-modal-invoice',
  templateUrl: './modal-invoice.component.html',
  styleUrls: ['./modal-invoice.component.scss']
})
export class ModalInvoiceComponent implements OnInit, OnDestroy {

  activeTab = 0;
  pdfGenerationStatus: string;
  subscription$ = new Subject();

  get invoiceStatus(): string {
    return this.modalInvoiceService.getCurrentInvoice().status;
  }

  get modalMode(): ModalMode | string {
    return this.modalModeService.getModalMode();
  }

  get invoiceType(): string {
    return this.modalInvoiceService.getInvoiceType();
  }

  constructor(
    public dialogRef: MatDialogRef<ModalInvoiceComponent>,
    public modalInvoiceService: ModalInvoiceService,
    public modalModeService: ModalModeService,
    private invoicesStore: Store<IInvoicesState>
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.getPdfGenerationStatus();
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  tabChanged($event: MatTabChangeEvent): void {
    this.activeTab = $event.index;
  }

  getPdfGenerationStatus(): void {
    this.invoicesStore.select(invoicesSelectors.selectPdfGenerationStatus)
      .pipe(takeUntil(this.subscription$))
      .subscribe((status: string) => {
        if (status === 'Generating' && this.modalModeService.getModalMode() !== 'Add') {
          this.invoicesStore.dispatch(invoicesActions.pdfGenerationStatus({
            id: this.modalInvoiceService.getCurrentInvoice().id,
            delayTime: 2000
          }));
        }
        if (status !== 'Loading') {
          this.pdfGenerationStatus = status;
        }
      });
  }
}
