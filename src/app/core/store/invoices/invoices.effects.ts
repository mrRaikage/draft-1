import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as assetsActions from '../asset/asset.actions';
import * as transactionsActions from '../transactions/transactions.actions';
import * as invoicesActions from './invoices.actions';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { InvoiceApiService } from '../../services/api/invoice-api.service';
import { TransactionsApiService } from '../../services/api/transactions-api.service';
import { InvoiceModel } from '../../interfaces/invoice.interface';
import { LedgerItemModel, TransactionModel } from '../../interfaces/transaction.interface';
import { ErrorMessageService } from '../../services/api/error-message.service';

@Injectable()
export class InvoicesEffects {

  constructor(
    private actions$: Actions,
    private toastr: ToastrService,
    private router: Router,
    private invoiceApiService: InvoiceApiService,
    private transactionsApiService: TransactionsApiService,
    private lSService: LocalStorageService,
    private errorMessageService: ErrorMessageService
  ) {}

  /** Get Invoices */
  invoiceData$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.invoicesData),
    switchMap(() => this.invoiceApiService.getInvoices().pipe(
      map((list: InvoiceModel[]) => invoicesActions.invoicesDataSuccess({ list })),
      catchError(() => of(invoicesActions.invoicesDataFailure()))
    ))
  ));

  /** Get Invoices number */
  invoicesNumber$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.invoicesNumber),
    switchMap(() => this.invoiceApiService.getInvoiceNumber(this.lSService.getCurrentOrg().id)
      .pipe(
        map((data: string) => invoicesActions.invoicesNumberSuccess({ data })),
        catchError(() => of(invoicesActions.invoicesNumberFailure()))
      )
    )
  ));

  /** Mark As Paid */
  invoiceMarkAsPaid$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.invoiceMarkAsPaid),
    switchMap(({ id, body }) => {
      return this.invoiceApiService.markAsPaid({ id, orgId: this.lSService.getCurrentOrg().id, body })
        .pipe(
          map((invoice: InvoiceModel) => {
            this.toastr.success('Invoice Marked as Paid');
            return invoicesActions.invoiceMarkAsPaidSuccess({ invoice });
          }),
          catchError((err) => {
            this.toastr.error(this.errorMessageService.getMessage(err) || 'Oops! Invoice Not Marked as Paid');
            return of(invoicesActions.invoiceMarkAsPaidFailure());
          }),
        );
    })
  ));

  invoiceMarkAsPaidSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.invoiceMarkAsPaidSuccess),
    switchMap(() => [transactionsActions.transactionsData(), invoicesActions.invoicesData()])
  ));

  /** Add Invoice */
  addInvoice$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.addInvoice),
    switchMap(({ invoice, hasAssetAccount }) => this.invoiceApiService.addInvoice(invoice).pipe(
      map((invoiceResponse: InvoiceModel) => {
        this.toastr.success(`${invoice.type} Saved!`);
        return invoicesActions.addInvoiceSuccess({ invoice: invoiceResponse, hasAssetAccount });
      }),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! ${invoice.type} Not Saved!`);
        return of(invoicesActions.addInvoiceFailure());
      }),
    ))
  ));

  addInvoiceSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.addInvoiceSuccess),
    switchMap(({hasAssetAccount}) => {
      return hasAssetAccount
        ? [transactionsActions.transactionsData(), assetsActions.assetData(), invoicesActions.invoicesData()]
        : [transactionsActions.transactionsData(), invoicesActions.invoicesData()];
    })
  ));

  /** Edit Invoice */
  editInvoice$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.editInvoice),
    switchMap(({ invoice, hasAssetAccount }) => {
      return this.invoiceApiService.editInvoice(invoice, this.lSService.getCurrentOrg().id)
        .pipe(
          map((transactionResponse: InvoiceModel) => {
            this.toastr.success('Invoice Updated!');
            return invoicesActions.editInvoiceSuccess({ invoice: transactionResponse, hasAssetAccount });
          }),
          catchError((err) => {
            this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! ${invoice.type} Not Updated!`);
            return of(invoicesActions.editInvoiceFailure());
          }),
        );
    })
  ));

  editInvoiceSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.editInvoiceSuccess),
    switchMap(({ invoice, hasAssetAccount }) => {
      return hasAssetAccount
        ? [
            transactionsActions.transactionsData(),
            assetsActions.assetData(),
            invoicesActions.invoicesData(),
            invoicesActions.pdfGenerationStatus({ id: invoice.id, delayTime: 2000 })
          ]
        : [
            transactionsActions.transactionsData(),
            invoicesActions.invoicesData(),
            invoicesActions.pdfGenerationStatus({ id: invoice.id, delayTime: 2000 })
          ];
    }))
  );

  /** Delete Invoice */
  deleteInvoice$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.deleteInvoice),
    switchMap(({ id }) => this.invoiceApiService.deleteInvoice(id).pipe(
      map(() => {
        this.toastr.success('Invoice Deleted!');
        return invoicesActions.deleteInvoiceSuccess();
      }),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || 'Oops! Invoice Not Deleted');
        return of(invoicesActions.deleteInvoiceFailure());
      }),
    ))
  ));

  deleteInvoiceSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.deleteInvoiceSuccess),
    switchMap(() => [transactionsActions.transactionsData(), invoicesActions.invoicesData()])
  ));

  /** Approve Invoice */
  approveInvoice$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.approveInvoice),
    switchMap(({ id }) => {
      return this.invoiceApiService.approveInvoice(id)
        .pipe(
          map((invoice: InvoiceModel) => {
            this.toastr.success('Invoice Approved!');
            return invoicesActions.approveInvoiceSuccess({ invoice });
          }),
          catchError((err) => {
            this.toastr.error(this.errorMessageService.getMessage(err) || 'Oops! Invoice Not Approved');
            return of(invoicesActions.approveInvoiceFailure());
          }),
        );
    })
  ));

  approveInvoiceSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.approveInvoiceSuccess),
    switchMap(() => [transactionsActions.transactionsData(), invoicesActions.invoicesData()])
  ));

  /** Get Invoice Pdf Generation Status */
  pdfGenerationStatus$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.pdfGenerationStatus),
    switchMap(({ id, delayTime }) => this.invoiceApiService.getPdfGenerationStatus(id).pipe(
      map((status: string) => invoicesActions.pdfGenerationStatusSuccess({ status, id })),
      catchError(() => of(invoicesActions.pdfGenerationStatusFailure))
    ))
  ));

  /** Generate Pdf */
  generatePdf$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.generatePdf),
    switchMap(({ id }) => this.invoiceApiService.generatePdf(id)
      .pipe(
        map(() => invoicesActions.generatePdfSuccess({ id })),
        catchError(() => of(invoicesActions.generatePdfFailure))
      ))
  ));

  generatePdfSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.generatePdfSuccess),
    map(({ id }) => invoicesActions.pdfGenerationStatus({ id })),
  ));

  /** Get Invoice Ledger Items */
  invoiceLedgerItems$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.invoiceLedgerItems),
    switchMap(({ invoiceId }) => this.invoiceApiService.getInvoiceLedgerItems(invoiceId, this.lSService.getCurrentOrg().id)
      .pipe(
        map((data: LedgerItemModel[]) => invoicesActions.invoiceLedgerItemsSuccess({ data })),
        catchError(() => of(invoicesActions.invoiceLedgerItemsFailure()))
      )
    )
  ));

  /** Edit Invoice Ledger Items */
  editInvoiceLedgerItems$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.editInvoiceLedgerItems),
    switchMap(({ transaction }) => this.transactionsApiService.editTransactionLedgerEntries(transaction, this.lSService.getCurrentOrg().id)
      .pipe(
        map((transactionModel: TransactionModel) => {
          this.toastr.success('Ledger Items Updated!');
          return invoicesActions.editInvoiceLedgerItemsSuccess({ transactionModel });
        }),
        catchError((err) => {
          this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Ledger Items Not Updated!`);
          return of(invoicesActions.invoiceLedgerItemsFailure());
        })
      )
    )
  ));

  editInvoiceLedgerItemsSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.editInvoiceLedgerItemsSuccess),
    map(({ transactionModel }) => invoicesActions.invoiceLedgerItems({ invoiceId: transactionModel.invoice.id }))
  ));

  /** Download Invoice */
  downloadTransactionInvoice$ = createEffect(() => this.actions$.pipe(
    ofType(invoicesActions.downloadInvoice),
    switchMap(({ transactionId }) => this.invoiceApiService.downloadInvoice(transactionId)
      .pipe(
        map((data: string) => {
          return invoicesActions.downloadInvoiceSuccess({ data });
        }),
        catchError((err) => {
          this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Invoice Not Downloaded`);
          return of(invoicesActions.downloadInvoiceFailure());
        }),
      )
    )
  ));

}
