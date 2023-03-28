import { ISelectListItem } from '../../shared/interfaces/select-control.interface';
import { AccountModel } from '../interfaces/account.interface';

export const emptyAccount: AccountModel = {
  accountTypeId: null,
  accountType: null,
  code: null,
  description: null,
  id: null,
  lookup: null,
  name: null,
  report: null,
  isCash: null,
  isSystem: false,
  hasOpeningBalance: false,
  openingBalanceAmount: 0,
  defaultTaxRate: null,
  openingBalanceDate: new Date(0).toDateString()
};

export const taxModeList: ISelectListItem<any>[] = [] = [
  {
    value: 0.15,
    displayName: '15%'
  },
  {
    value: 0,
    displayName: 'No Tax'
  }
];
