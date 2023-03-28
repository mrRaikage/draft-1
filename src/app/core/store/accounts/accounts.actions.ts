import { createAction, props } from '@ngrx/store';

import { AccountModel, AccountTypeModel, AddAccountDto, EditAccountDto } from '../../interfaces/account.interface';

/** Account */
export const accountsData = createAction('[Accounts] Accounts Data', props<{ isDataLoadedAfterAction?: boolean }>());
export const accountsDataSuccess = createAction('[Accounts] Accounts Data Success', props<{
  data: AccountModel[],
  accountTypes: AccountTypeModel[],
  isDataLoadedAfterAction?: boolean
}>());
export const accountsDataFailure = createAction('[Accounts] Accounts Data Failure');

export const addAccount = createAction('[Accounts] Add Account', props<{ data: AddAccountDto }>());
export const addAccountSuccess = createAction('[Accounts] Add Account Success', props<{ currentAccount: AccountModel }>());
export const addAccountFailure = createAction('[Accounts] Add Account Failure');

export const editAccount = createAction('[Accounts] Edit Account', props<{ data: EditAccountDto }>());
export const editAccountSuccess = createAction('[Accounts] Edit Account Success', props<{ currentAccount: AccountModel }>());
export const editAccountFailure = createAction('[Accounts] Edit Account Failure');

export const deleteAccount = createAction('[Accounts] Delete Account', props<{ id: string }>());
export const deleteAccountSuccess = createAction('[Accounts] Delete Account Success');
export const deleteAccountFailure = createAction('[Accounts] Delete Account Failure');

/** Clean State */
export const cleanState = createAction('[Accounts] Clean State');

