import { createSelector } from '@ngrx/store';

export const selectAccountsState = (state) => state;

export const selectAccountsData = createSelector(
  selectAccountsState,
  state => state.accounts.list
);

export const selectIsDataLoaded = createSelector(
  selectAccountsState,
  state => state.accounts.accountsDataLoaded
);

export const selectIsAccountActionDataLoaded = createSelector(
  selectAccountsState,
  state => state.accounts.isDataLoadedAfterAction
);

export const selectIsSpinnerStarted = createSelector(
  selectAccountsState,
  state => state.accounts.isSpinnerStarted
);

export const selectIsDeleteSpinnerStarted = createSelector(
  selectAccountsState,
  state => state.accounts.deleteSpinnerStarted
);

export const selectAccountTypes = createSelector(
  selectAccountsState,
  state => state.accounts.accountTypes
);

export const selectCurrentAccount = createSelector(
  selectAccountsState,
  state => state.accounts.currentAccount
);
