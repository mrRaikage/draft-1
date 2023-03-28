import { Action, createReducer, on } from '@ngrx/store';

import * as accountsActions from './accounts.actions';
import { AccountModel, AccountTypeModel } from '../../interfaces/account.interface';

export interface IAccountsState {
  list: AccountModel[];
  accountTypes: AccountTypeModel[];
  accountsDataLoaded: boolean;
  isDataLoadedAfterAction: boolean;
  isSpinnerStarted: boolean;
  deleteSpinnerStarted: boolean;
  currentAccount: AccountModel;
}

export const initialState: IAccountsState = {
  list: null,
  accountsDataLoaded: false,
  isDataLoadedAfterAction: false,
  accountTypes: null,
  isSpinnerStarted: false,
  deleteSpinnerStarted: false,
  currentAccount: null
};

export function accountsReducer(state: IAccountsState | undefined, action: Action): IAccountsState {
  return reducer(state, action);
}

const reducer = createReducer<IAccountsState>(
  initialState,

  /** Get Accounts */
  on(accountsActions.accountsData, state => ({
    ...state,
    accountsDataLoaded: false
    })
  ),

  on(accountsActions.accountsDataSuccess, (state, { data, accountTypes, isDataLoadedAfterAction }) => ({
      ...state,
    list: data,
    accountTypes,
    accountsDataLoaded: true,
    isDataLoadedAfterAction,
    isSpinnerStarted: false,
    deleteSpinnerStarted: false
    })
  ),

  /** Add Account */
  on(accountsActions.addAccount, state => ({
    ...state,
    currentAccount: null,
    isSpinnerStarted: true,
    isDataLoadedAfterAction: false
  })),

  on(accountsActions.addAccountSuccess, (state, { currentAccount }) => ({
    ...state,
    currentAccount,
    isSpinnerStarted: false,
  })),

  on(accountsActions.addAccountFailure, state => ({
      ...state,
      isSpinnerStarted: false,
    })
  ),

  /** Edit Account */
  on(accountsActions.editAccount, state => ({
      ...state,
      isSpinnerStarted: true,
      isDataLoadedAfterAction: false
    })
  ),
  on(accountsActions.editAccountSuccess, (state, { currentAccount }) => ({
      ...state,
      currentAccount,
      isSpinnerStarted: false,
    })
  ),
  on(accountsActions.editAccountFailure, state => ({
      ...state,
      isSpinnerStarted: false,
    })
  ),

  /** Delete Account */
  on(accountsActions.deleteAccount, state => ({
      ...state,
      deleteSpinnerStarted: true,
      isDataLoadedAfterAction: false
    })
  ),
  on(accountsActions.deleteAccountFailure, state => ({
      ...state,
      deleteSpinnerStarted: false
    })
  ),

  /** Clean State */
  on(accountsActions.cleanState, state => initialState)
);
