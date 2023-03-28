import { AccountModel, AccountTypeModel } from '../../../core/interfaces/account.interface';

export function getAccountGroups(accounts: AccountModel[]) {
  const grouped = {};
  accounts
    .filter((account: AccountModel) => Boolean(account.accountType && account.accountType.parentType))
    .map((account: AccountModel) => {
      if (grouped[account.accountType.parentType]) {
        grouped[account.accountType.parentType].children.push(account);
      } else {
        grouped[account.accountType.parentType] = {
          displayName: account.accountType.parentType,
          children: [ account ]
        };
      }
    });
  return grouped;
}

export function getAccountTypesGroups(types: AccountTypeModel[]) {
  const grouped = {};
  types.filter((type: AccountTypeModel) => Boolean(type.parentType)).map((type: AccountTypeModel) => {
    if (grouped[type.parentType]) {
      grouped[type.parentType].children.push(type);
    } else {
      grouped[type.parentType] = {
        displayName: type.parentType,
        children: [ type ]
      };
    }
  });
  return grouped;
}
