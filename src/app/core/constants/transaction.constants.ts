import * as moment from 'moment';
import { InvoiceLineModel } from '../interfaces/invoice.interface';

import {
  LedgerItemModel,
  ManualLedgersDto,
  TaxModel,
  TransactionLineModel,
  TransactionModel
} from '../interfaces/transaction.interface';
import { GroupOfList } from '../../shared/components/button-drop-down/button-drop-down.component';


export const tableColumnsData: { [key: string]: string } = {
  dropDown: '',
  date: 'Date',
  type: 'Type',
  direction: 'Direction',
  details: 'Details',
  party: 'Other Party',
  amount: 'Amount',
  more: ''
};

export const nestedTableColumnsData: { [key: string]: string } = {
  date: 'Date',
  account: 'Account',
  description: 'Description',
  amount: 'Amount'
};

export const actionGroupedList: GroupOfList[] = [
  {
    displayName: 'Bills',
    children: [
      { key: 'receiveBill', displayName: 'Record New' },
      { key: 'payBill', displayName: 'Mark as Paid' }
    ]
  },
  {
    displayName: 'Invoice',
    children: [
      { key: 'recordInvoice', displayName: 'Record New' },
      { key: 'invoicePaid', displayName: 'Mark as Paid' }
    ]
  },
  {
    displayName: 'Expense',
    children: [
      { key: 'recordExpense', displayName: 'Record New' }
    ]
  },
  {
    displayName: 'Other',
    children: [
      { key: 'recordTransaction', displayName: 'Record New custom' },
      { key: 'recordManualLedger', displayName: 'Create Manual Ledger' }
    ]
  }
];

export const emptyInvoiceLines: InvoiceLineModel = {
  chargeIds: null,
  date: null,
  id: null,
  description: null,
  quantity: null,
  units: null,
  unitsString: null,
  rate: null,
  taxRate: null,
  amount: null,
  accountId: null,
  account: null
};

export const emptyManualLedgers: ManualLedgersDto = {
  ledgerItems: new Array(2).fill({
    accountId: null,
    credit: 0,
    debit: 0,
    date: null
  }),
  date: null,
  details: null,
  direction: null,
  party: null,
  ref: null,
  type: null,
  amount: null
};

export const emptyTransaction: TransactionModel = {
  amount: null,
  id: null,
  party: null,
  details: null,
  direction: null,
  ref: null,
  date: null,
  type: null,
  taxMode: null,
  lines: null,
  expense: null,
  ledgerItems: null,
  tax: null,
  subTotal: null,
  invoice: {
    jobId: null,
    dueDate: null,
    date: null,
    id: null,
    number: null,
    status: null,
    type: null,
    billTo: null,
    invoiceLines: [emptyInvoiceLines],
    paidDate: null,
    paidIntoAccountId: null,
    generationStatus: null,
    clientId: null,
    amount: null,
    subtotal: null,
    tax: null,
    taxMode: null,
    details: null,
    party: null,
    ref: null,
    hasManualLedger: null
  }
};

export const emptyTransactionLine: TransactionLineModel = {
  description: null,
  account: null,
  accountId: null,
  amount: null,
  taxRate: null,
  id: null
};

export const emptyLedgerEntriesLine: LedgerItemModel = {
  rule: null,
  accountId: '',
  id: '',
  credit: null,
  debit: null,
  date: moment().format()
};

export enum TaxMode {
  Inclusive = 'Inclusive',
  Exclusive = 'Exclusive',
  NoTax = 'NoTax'
}

export const taxModel: { [key: string]: TaxModel } = {
  Inclusive: {
    displayName: 'Tax Inclusive',
    value: TaxMode.Inclusive
  },
  Exclusive: {
    displayName: 'Tax Exclusive',
    value: TaxMode.Exclusive
  },
  NoTax: {
    displayName: 'No tax',
    value: TaxMode.NoTax
  }
};

export enum TransactionType {
  Cash = 'Cash',
  Invoice = 'Invoice',
  Bill = 'Bill',
  ManualLedger = 'Manualledger',
  Expense = 'Expense',
  Balance = 'Balance'
}

export enum InvoiceType {
  Invoice = 'Invoice',
  Bill = 'Bill'
}

export enum ModalMode {
  View = 'View',
  Edit = 'Edit',
  Add = 'Add',
}


