import { AccountModel } from './account.interface';
import { PriceBookItemModel } from './price-book.interface';
import { InvoiceType, TaxMode, TransactionType } from '../constants/transaction.constants';

export interface InvoiceModel {
  invoiceLines: InvoiceLineModel[];
  jobId: string;
  dueDate: string;
  id: string;
  billTo: string;
  number: string;
  status: string;
  type: InvoiceType;
  paidDate: string;
  paidIntoAccountId: string;
  clientId: string;
  generationStatus: string;
  date: string;
  details: string;
  amount: number;
  subtotal: number;
  tax: number;
  taxMode: TaxMode;
  party: string;
  ref: string;
  hasManualLedger: boolean;
}

export interface InvoiceLineModel {
  id: string;
  description: string;
  quantity: number;
  units: number;
  unitsString: string | PriceBookItemModel;
  rate: number;
  taxRate: number;
  amount: number;
  accountId: string;
  account?: AccountModel;
  chargeIds: string[];
  date: string;
}

/** Needs to refactoring */
/** Invoice requests */
export interface AddInvoiceDto {
  dueDate: string;
  number: string;
  status: string;
  billTo: string;
  type: string;
  paidDate: string;
  date: string;
  paidIntoAccountId: string;
  jobId: string;
  clientId: string;
  generationStatus: string;
  details: string;
  amount: number;
  subtotal: number;
  tax: number;
  party: string;
  ref: string;
  taxMode: TaxMode;
  invoiceLines: AddInvoiceLineDto[];
}

export interface EditInvoiceDto extends AddInvoiceDto {
  id: string;
  paidDate: string;
  paidIntoAccountId: string;
}

/** Transaction Invoice Requests */
export interface AddTransactionInvoiceDto {
  party: string;
  details: string;
  direction: string;
  ref: string;
  type: TransactionType;
  date: string;
  taxMode: TaxMode;
  amount: number;
  subTotal: number;
  tax: number;
  invoice: AddInvoiceDto;
}

export interface EditTransactionInvoiceDto {
  id: string;
  party: string;
  details: string;
  direction: string;
  ref: string;
  type: TransactionType;
  amount: number;
  subTotal: number;
  tax: number;
  date: string;
  taxMode: TaxMode;
  invoice: EditInvoiceDto;
}

export interface InvoiceLineDto {
  id: string;
  description: string;
  unitsString: string;
  quantity: number;
  rate: number;
  taxRate: number;
  amount: number;
  accountId: string;
  chargeIds?: string[];
  date: string;
}

export interface AddInvoiceLineDto {
  description: string;
  unitsString: string;
  quantity: number;
  rate: number;
  taxRate: number;
  amount: number;
  accountId: string;
  chargeIds?: string[];
  date: string;
}
