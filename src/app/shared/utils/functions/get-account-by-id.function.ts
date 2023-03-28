import { AccountModel } from '../../../core/interfaces/account.interface';

export function getAccountById(accounts: AccountModel[], accountId: string): AccountModel {
  return accounts.find((account: AccountModel) => account.id === accountId);
}
