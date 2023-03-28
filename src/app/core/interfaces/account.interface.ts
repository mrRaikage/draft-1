export interface AccountModel {
  accountTypeId: string;
  code: number;
  id:	string;
  lookup: string;
  name: string;
  report:	string;
  isCash: boolean;
  isSystem: boolean;
  hasOpeningBalance: boolean;
  openingBalanceAmount: number;
  openingBalanceDate: string;
  defaultTaxRate: number;
  accountType?: AccountTypeModel;
  description?: string;
}

export interface AccountTypeModel {
  id: string;
  name: string;
  parentType: string;
  lookup: string;
}

/** Account Request */
export interface AddAccountDto {
  accountTypeId: string;
  defaultTaxRate: number;
  code?: number;
  name: string;
  report?: string;
  description?: string;
  isCash?: boolean;
  isSystem?: boolean;
  hasOpeningBalance?: boolean;
  openingBalanceAmount?: number;
  openingBalanceDate?: string;
}

export interface EditAccountDto {
  accountTypeId: string;
  defaultTaxRate: number;
  code: number;
  name: string;
  report: string;
  description: string;
  isCash: boolean;
  id: string;
  isSystem: boolean;
  hasOpeningBalance: boolean;
  openingBalanceAmount?: number;
  openingBalanceDate?: string;
}

