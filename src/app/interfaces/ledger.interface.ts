import { AccountModel } from '../core/interfaces/account.interface';

export interface LedgerDataModel {
  items: LedgerItem[];
  nextPage: string;
  previousPage: string;
}

export interface LedgerItem {
  accountId: string;
  credit: number;
  debit: number;
  id: string;
  rule: string;
  transactionId: string;
  date: string;
  party: string;
  account?: AccountModel;
}

export interface LedgerParamsModel {
  MinDate: string;
  AccountIds: AccountModel[];
  MaxDate: string;
  Term?: string | null;
  Page?: string;
  Limit?: string;
}
