import { AccountModel } from '../../../core/interfaces/account.interface';
import { InvoiceLineModel, InvoiceModel } from '../../../core/interfaces/invoice.interface';
import {
  LedgerItemModel,
  TransactionLineModel,
  TransactionModel
} from '../../../core/interfaces/transaction.interface';
import { getAccountById } from './get-account-by-id.function';

export function touchTransaction(accounts: AccountModel[], transaction: TransactionModel): TransactionModel {
  return {
    ...transaction,
    lines: touchTransactionLines(accounts, transaction.lines),
    ledgerItems: touchTransactionLedgerItems(accounts, transaction.ledgerItems)
  };
}

export function touchTransactionLines(accounts: AccountModel[], lines: TransactionLineModel[]): TransactionLineModel[] {
  return lines.map((line: TransactionLineModel) => ({
    ...line,
    account: getAccountById(accounts, line.accountId)
  }));
}

export function touchTransactionLedgerItems(accounts: AccountModel[], ledgerItems: LedgerItemModel[]): LedgerItemModel[] {
  return ledgerItems.map((item: LedgerItemModel) => ({
    ...item,
    account: getAccountById(accounts, item.accountId)
  }));
}

export function touchInvoice(accounts: AccountModel[], invoice: InvoiceModel): InvoiceModel {
  return {
    ...invoice,
    invoiceLines: touchInvoiceLines(accounts, invoice.invoiceLines)
  };
}

export function touchInvoiceLines(accounts: AccountModel[], lines: InvoiceLineModel[]): InvoiceLineModel[] {
  return lines.map((line: InvoiceLineModel) => ({
    ...line,
    account: getAccountById(accounts, line.accountId)
  }));
}
