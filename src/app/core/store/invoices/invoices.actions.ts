import { createAction, props } from '@ngrx/store';
import {
  EditTransactionDto,
  LedgerItemModel,
  TransactionModel
} from '../../interfaces/transaction.interface';
import { InvoiceModel } from '../../interfaces/invoice.interface';

/** Get Invoices */
export const invoicesData = createAction('[Invoices] Invoices Data');
export const invoicesDataSuccess = createAction('[Invoices] Invoices Data Success', props<{ list: InvoiceModel[] }>());
export const invoicesDataFailure = createAction('[Invoices] Invoices Data Failure');

/** CRUD Invoice */
/** -- add -- */
export const addInvoice = createAction('[Invoices] Add Invoice', props<{ invoice: any, hasAssetAccount?: boolean }>());
export const addInvoiceSuccess = createAction('[Invoices] Add Invoice Success', props<{ invoice: any, hasAssetAccount?: boolean }>());
export const addInvoiceFailure = createAction('[Invoices] Add Invoice Failure');

/** -- edit -- */
export const editInvoice = createAction('[Invoices] Edit Invoice', props<{ invoice: any, hasAssetAccount?: boolean }>());
export const editInvoiceSuccess = createAction('[Invoices] Edit Invoice Success', props<{ invoice: InvoiceModel, hasAssetAccount?: boolean }>());
export const editInvoiceFailure = createAction('[Invoices] Edit Invoice Failure');

/** -- delete -- */
export const deleteInvoice = createAction('[Invoices] Delete Invoice', props<{ id: string }>());
export const deleteInvoiceSuccess = createAction('[Invoices] Delete Invoice Success');
export const deleteInvoiceFailure = createAction('[Invoices] Delete Invoice Failure');

/** Get Invoice Pdf Generation Status */
export const generatePdf = createAction('[Invoices] Generate Pdf', props<{ id: string }>());
export const generatePdfSuccess = createAction('[Invoices] Generate Pdf Success', props<{ id: string }>());
export const generatePdfFailure = createAction('[Invoices] Generate Pdf Failure');

/** Get Invoice Pdf Generation Status */
export const pdfGenerationStatus = createAction('[Invoices] Get Pdf Generation Status', props<{ id: string, delayTime?: number }>());
export const pdfGenerationStatusSuccess = createAction('[Invoices] Get Pdf Generation Status Success', props<{ status: string, id: string }>());
export const pdfGenerationStatusFailure = createAction('[Invoices] Get Pdf Generation Status Failure');

/** Get Invoices number */
export const invoicesNumber = createAction('[Invoices] Invoices Number');
export const invoicesNumberSuccess = createAction('[Invoices] Invoices Number Success', props<{ data: string }>());
export const invoicesNumberFailure = createAction('[Invoices] Invoices Number Failure');

/** Approve Transaction Invoice */
export const approveInvoice = createAction('[Invoices] Approve Invoice', props<{ id: string }>());
export const approveInvoiceSuccess = createAction('[Invoices] Approve Invoice Success', props<{ invoice: InvoiceModel }>());
export const approveInvoiceFailure = createAction('[Invoices] Approve Invoice Failure');

/** Mark As Paid */
export const invoiceMarkAsPaid = createAction('[Invoices] Invoice Mark As Paid', props<{ id: string, body?: any }>());
export const invoiceMarkAsPaidSuccess = createAction('[Invoices] Invoice Mark As Paid Success', props<{ invoice: InvoiceModel }>());
export const invoiceMarkAsPaidFailure = createAction('[Invoices] Invoice Mark As Paid Failure');

/** Get Invoice Ledger Items */
export const invoiceLedgerItems = createAction('[Invoices] Ledger Items', props<{ invoiceId: string }>());
export const invoiceLedgerItemsSuccess = createAction('[Invoices] Ledger Items Success', props<{ data: LedgerItemModel[] }>());
export const invoiceLedgerItemsFailure = createAction('[Invoices] Ledger Items Failure');

/** Edit Invoice Ledger Items */
export const editInvoiceLedgerItems = createAction('[Invoices] Edit Ledger Items', props<{ transaction: EditTransactionDto }>());
export const editInvoiceLedgerItemsSuccess = createAction('[Invoices] Edit Ledger Items Success', props<{ transactionModel: TransactionModel }>());
export const editInvoiceLedgerItemsFailure = createAction('[Invoices] Edit Ledger Items Failure');

/** Download Invoice */
export const downloadInvoice = createAction('[Invoices] Download Invoice', props<{ transactionId: string }>());
export const downloadInvoiceSuccess = createAction('[Invoices] Download Invoice Success', props<{ data: string }>());
export const downloadInvoiceFailure = createAction('[Invoices] Download Invoice Failure');

