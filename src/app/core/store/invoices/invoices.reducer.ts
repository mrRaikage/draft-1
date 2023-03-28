import { Action, createReducer, on } from '@ngrx/store';

import * as invoicesActions from './invoices.actions';
import { InvoiceModel } from '../../interfaces/invoice.interface';
import { LedgerItemModel } from '../../interfaces/transaction.interface';

export interface IInvoicesState {
  list: InvoiceModel[];
  dataLoaded: boolean;
  spinnerStarted: boolean;
  invoiceNumberLoading: boolean;
  invoiceNumber: string;
  dataLoadedAfterAction: boolean;
  currentInvoice: InvoiceModel;
  pdfGenerationStatus: string;
  isPdfLoading: boolean;
  generatePdfSpinner: boolean;
  ledgerItemsList: LedgerItemModel[];
  ledgerItemsLoading: boolean;
  downloadedInvoicePdf: any;
  downloadInvoiceSpinner: boolean;
  deleteInvoiceSpinnerStarted: boolean;
  viewInvoiceSpinner: boolean;
}

export const initialState: IInvoicesState = {
  list: null,
  dataLoaded: false,
  spinnerStarted: false,
  invoiceNumberLoading: false,
  invoiceNumber: null,
  deleteInvoiceSpinnerStarted: false,
  dataLoadedAfterAction: true,
  currentInvoice: null,
  pdfGenerationStatus: null,
  isPdfLoading: false,
  generatePdfSpinner: false,
  ledgerItemsList: null,
  ledgerItemsLoading: false,
  downloadedInvoicePdf: null,
  downloadInvoiceSpinner: false,
  viewInvoiceSpinner: false
};

export function invoicesReducer(state: IInvoicesState | undefined, action: Action): IInvoicesState {
  return reducer(state, action);
}

const reducer = createReducer<IInvoicesState>(
  initialState,

  /** Get Invoices */
  on(invoicesActions.invoicesData, (state) => ({
    ...state,
    dataLoaded: false,
    dataLoadedAfterAction: false
  })),

  on(invoicesActions.invoicesDataSuccess, (state, { list }) => ({
    ...state,
    list,
    dataLoaded: true,
    dataLoadedAfterAction: true,
    spinnerStarted: false
  })),

  on(invoicesActions.invoicesDataFailure, (state) => ({
    ...state,
    dataLoaded: true,
    dataLoadedAfterAction: true,
    spinnerStarted: false
  })),

  /** Add Invoice */
  on(invoicesActions.addInvoice, state => ({
    ...state,
    currentInvoice: null,
    dataLoadedAfterAction: false,
    spinnerStarted: true
  })),

  on(invoicesActions.addInvoiceSuccess, (state, { invoice }) => ({
    ...state,
    currentInvoice: invoice,
  })),

  on(invoicesActions.addInvoiceFailure, state => ({
    ...state,
    spinnerStarted: false,
  })),

  /** Edit Transaction Invoice */
  on(invoicesActions.editInvoice, state => ({
    ...state,
    currentInvoice: null,
    dataLoadedAfterAction: false,
    spinnerStarted: true
  })),

  on(invoicesActions.editInvoiceSuccess, (state, { invoice }) => ({
    ...state,
    currentInvoice: invoice
  })),

  on(invoicesActions.editInvoiceFailure, state => ({
    ...state,
    spinnerStarted: false
  })),

  /** Delete Invoice */
  on(invoicesActions.deleteInvoice, state => ({
    ...state,
    dataLoadedAfterAction: false,
    deleteInvoiceSpinnerStarted: true,
  })),

  on(invoicesActions.deleteInvoiceSuccess, state => ({
    ...state,
    deleteInvoiceSpinnerStarted: false,
  })),

  on(invoicesActions.deleteInvoiceFailure, state => ({
    ...state,
    deleteInvoiceSpinnerStarted: false
  })),

  /** Approve Transaction Invoice */
  on(invoicesActions.approveInvoice, state => ({
    ...state,
    currentInvoice: null,
    dataLoadedAfterAction: false,
    spinnerStarted: true,
  })),

  on(invoicesActions.approveInvoiceSuccess, (state, { invoice }) => ({
    ...state,
    currentInvoice: invoice
  })),

  on(invoicesActions.approveInvoiceFailure, state => ({
    ...state,
    spinnerStarted: false,
  })),

  /** Invoice Mark As Paid */
  on(invoicesActions.invoiceMarkAsPaid, state => ({
    ...state,
    dataLoadedAfterAction: false,
    spinnerStarted: true
  })),

  on(invoicesActions.invoiceMarkAsPaidSuccess, (state, { invoice }) => ({
    ...state,
    currentInvoice: invoice
  })),

  on(invoicesActions.invoiceMarkAsPaidFailure, state => ({
    ...state,
    spinnerStarted: false
  })),

  /** Get Invoice Generation Status */
  on(invoicesActions.pdfGenerationStatus, state  => ({
    ...state,
    pdfGenerationStatus: 'Loading'
  })),

  on(invoicesActions.pdfGenerationStatusSuccess, (state, { status }) => ({
    ...state,
    pdfGenerationStatus: status
  })),

  /** Get Invoice Gen Number */
  on(invoicesActions.invoicesNumber, state => ({
    ...state,
    invoiceNumber: null,
    invoiceNumberLoading: true
  })),

  on(invoicesActions.invoicesNumberSuccess, (state, { data }) => ({
    ...state,
    invoiceNumber: data,
    invoiceNumberLoading: false
  })),

  on(invoicesActions.invoicesNumberFailure, state => ({
    ...state,
    invoiceNumberLoading: false
  })),

  /** Generate Pdf */
  on(invoicesActions.generatePdf, state => ({
    ...state,
    generatePdfSpinner: true
  })),

  on(invoicesActions.generatePdfSuccess, state => ({
    ...state,
    generatePdfSpinner: false
  })),

  on(invoicesActions.generatePdfFailure, state => ({
    ...state,
    generatePdfSpinner: false
  })),

  /** Get Ledger Items */
  on(invoicesActions.invoiceLedgerItems, state => ({
    ...state,
    ledgerItemsLoading: true
  })),

  on(invoicesActions.invoiceLedgerItemsSuccess, (state, { data }) => ({
    ...state,
    ledgerItemsList: data,
    ledgerItemsLoading: false
  })),

  on(invoicesActions.invoiceLedgerItemsFailure, state => ({
    ...state,
    spinnerStarted: false,
    ledgerItemsLoading: false
  })),

  /** Edit Ledger Items */
  on(invoicesActions.editInvoiceLedgerItems, state => ({
    ...state,
    dataLoadedAfterAction: false,
    spinnerStarted: true
  })),

  on(invoicesActions.editInvoiceLedgerItemsSuccess, (state, { transactionModel }) => ({
    ...state,
    currentInvoice: transactionModel.invoice,
    spinnerStarted: false,
    dataLoadedAfterAction: true
  })),

  on(invoicesActions.editInvoiceLedgerItemsFailure, state => ({
    ...state,
    spinnerStarted: false
  })),

  /** Download Invoice */
  on(invoicesActions.downloadInvoice, (state) => ({
    ...state,
    isPdfLoading: true,
    downloadedInvoicePdf: null
  })),

  on(invoicesActions.downloadInvoiceSuccess, (state, { data }) => ({
    ...state,
    isPdfLoading: false,
    downloadedInvoicePdf: data
  })),

  on(invoicesActions.downloadInvoiceFailure, state => ({
    ...state,
    isPdfLoading: false,
    viewInvoiceSpinner: false
  })),
);
