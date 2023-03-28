import { AddAccountDto, AccountModel, EditAccountDto } from '../interfaces/account.interface';

export const mapAddAccountModelToDto = (
  model: AccountModel
): AddAccountDto => {
  const balanceData = model.hasOpeningBalance
    ? { openingBalanceAmount: model.openingBalanceAmount, openingBalanceDate: model.openingBalanceDate }
    : {};
  return {
    code: model.code,
    name: model.name,
    report: model.report,
    description: model.description,
    accountTypeId: model.accountTypeId,
    isCash: model.isCash,
    isSystem: model.isSystem,
    defaultTaxRate: model.defaultTaxRate,
    hasOpeningBalance: model.hasOpeningBalance,
    ...balanceData
  };
};

export const mapEditAccountModelToDto = (
  model: AccountModel
): EditAccountDto => {
  const balanceData = model.hasOpeningBalance
    ? { openingBalanceAmount: model.openingBalanceAmount, openingBalanceDate: model.openingBalanceDate }
    : {};
  return {
    code: model.code,
    name: model.name,
    report: model.report,
    description: model.description,
    accountTypeId: model.accountTypeId,
    id: model.id,
    isCash: model.isCash,
    isSystem: model.isSystem,
    defaultTaxRate: model.defaultTaxRate,
    hasOpeningBalance: model.hasOpeningBalance,
    ...balanceData
  };
};

