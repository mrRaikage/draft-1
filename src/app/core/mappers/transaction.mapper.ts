import * as moment from 'moment';

import {
  AddTransactionDto,
  EditTransactionDto,
  AddTransactionLineDto,
  TransactionLineModel,
  EditTransactionLineDto,
  LedgerItemModel,
  LedgerItemDto,
  TransactionModel
} from '../interfaces/transaction.interface';


export const mapAddTransactionModelToDto = (
  model: TransactionModel
): AddTransactionDto => ({
  party: model.party,
  details: model.details,
  direction: model.direction,
  ref: model.ref,
  type: model.type,
  date: moment(model.date).format('YYYY-MM-DD'),
  taxMode: model.taxMode,
  lines: model.lines ? model.lines.map((line: TransactionLineModel) => mapAddTransactionLineModelToDto(line)) : null,
  invoice: null, /** TODO: refactor this */
  linkedCashAccountId: model.linkedCashAccountId,
  amount: model.amount,
  subTotal: model.subTotal,
  Tax: model.tax
});

export const mapEditTransactionModelToDto = (
  model: TransactionModel
): EditTransactionDto => ({
  party: model.party,
  details: model.details,
  direction: model.direction,
  ref: model.ref,
  type: model.type,
  date: moment(model.date).format('YYYY-MM-DD'),
  taxMode: model.taxMode,
  lines: model.lines.map((line: TransactionLineModel) => mapEditTransactionLineModelToDto(line)),
  invoice: null, /** TODO: refactor this */
  id: model.id,
  linkedCashAccountId: model.linkedCashAccountId,
  hasManualLedger: model.hasManualLedger,
  ledgerItems: model.ledgerItems.map((ledger: LedgerItemModel) => mapTransactionLedgerItemModelToDto(ledger)),
  ModifiedTransactionLines: model.ModifiedTransactionLines,
  amount: model.amount,
  subTotal: model.subTotal,
  Tax: model.tax
});

const mapTransactionLedgerItemModelToDto = (
  model: LedgerItemModel
): LedgerItemDto => ({
  accountId: model.account.id,
  credit: model.credit,
  debit: model.debit,
  id: model.id,
  rule: model.rule,
  transactionId: model.transactionId,
  date: moment(model.date).format('YYYY-MM-DD')
});

const mapAddTransactionLineModelToDto = (
  model: TransactionLineModel
): AddTransactionLineDto => ({
  description: model.description,
  amount: model.amount,
  taxRate: model.taxRate,
  accountId: model.account.id
});

const mapEditTransactionLineModelToDto = (
  model: TransactionLineModel
): EditTransactionLineDto => ({
  description: model.description,
  amount: model.amount,
  accountId: model.account && model.account.id ? model.account.id : model.accountId,
  taxRate: model.taxRate,
  id: model.id
});
