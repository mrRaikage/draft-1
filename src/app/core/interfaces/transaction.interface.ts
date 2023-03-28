import { Observable } from 'rxjs';

import { AccountModel } from './account.interface';
import { AddInvoiceDto, EditInvoiceDto, InvoiceModel } from './invoice.interface';
import { TaxMode, TransactionType } from '../constants/transaction.constants';

/** Transaction Response */
export interface TransactionModel {
  amount: number;
  date: string;
  details: string;
  direction: string;
  id: string;
  invoice: InvoiceModel;
  ledgerItems: LedgerItemModel[];
  lines: TransactionLineModel[];
  expense: ExpenseModel;
  party: string;
  ref: string;
  taxMode: TaxMode;
  type: TransactionType;
  linkedCashAccountId?: string;
  hasManualLedger?: boolean;
  ModifiedTransactionLines?: boolean;
  tax: number;
  subTotal: number;
}

export interface ManualLedgersDto {
  ledgerItems: ManualLedgerItemDto[];
  date: string;
  details: string;
  direction: string;
  party: string;
  ref: string;
  type: string;
  amount: number;
}

export interface ManualLedgersModel extends ManualLedgersDto {
  id?: string;
}

export interface ManualLedgerItemDto {
  accountId: string;
  credit: number;
  debit: number;
  date: string;
}

export interface TransactionLineModel {
  accountId: string;
  amount: number;
  description: string;
  id: string;
  taxRate: number;
  account?: AccountModel;
}

export interface LedgerItemModel {
  id: string;
  accountId: string;
  account?: AccountModel;
  credit: number;
  debit: number;
  rule: string;
  date: string;
  transactionId?: string;
}

/** Transaction Request */
export interface AddTransactionDto {
  party: string;
  details: string;
  direction: string;
  ref: string;
  type: TransactionType;
  date: string;
  taxMode: TaxMode;
  lines: AddTransactionLineDto[];
  invoice: AddInvoiceDto;
  linkedCashAccountId: string;
  amount: number;
  subTotal: number;
  Tax: number;
}

export interface EditTransactionDto {
  party: string;
  details: string;
  direction: string;
  ref: string;
  type: TransactionType;
  date: string;
  taxMode: TaxMode;
  lines: EditTransactionLineDto[];
  invoice: EditInvoiceDto;
  id: string;
  linkedCashAccountId: string;
  ledgerItems: LedgerItemDto[];
  hasManualLedger: boolean;
  ModifiedTransactionLines: boolean;
  amount: number;
  subTotal: number;
  Tax: number;
}

export interface AddTrxExpenseDto {
  amount: number;
  date: string;
  details: string;
  party: string;
  ref: string;
  type: TransactionType;
  direction: string;
  taxMode: TaxMode;
  lines: AddTransactionLineDto[];
  expense: ExpenseModel;
}

export interface ExpenseModel {
  id?: string;
  paidFromType: PaidFromTypes;
  paidFromAccountId: string;
  needsReimbursed: boolean;
  whoPaidString: string;
  whoPaidAccountId: string;
  dueDate: string;
}

export enum PaidFromTypes {
  Personal = 'Personal',
  Account = 'Account'
}

export interface EditTrxExpenseDto extends AddTrxExpenseDto {
  id: string;
  lines: EditTransactionLineDto[];
}

export interface LedgerItemDto {
  accountId: string;
  credit: number;
  debit: number;
  id: string;
  rule: string;
  transactionId: string;
  date: string;
}

export interface AddTransactionLineDto {
  description: string;
  amount: number;
  accountId: string;
  taxRate: number;
}

export interface EditTransactionLineDto extends AddTransactionLineDto {
  id: string;
}

/** Modal Transaction Data */
export interface ModalTransactionData {
  accounts$: Observable<AccountModel[]>;
}

/** Transactions Csv Data */
export interface TransactionScvModel {
  columns: string[];
  rows: { [key: string]: string }[];
}

/** Tax Model */
export interface TaxModel {
  displayName: string;
  value: TaxMode;
}

export interface QuickAddAccountModel {
  name: string;
  accountTypeId: string;
  defaultTaxRate: TaxModel;
}




