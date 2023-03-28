import { createSelector } from '@ngrx/store';

export const selectTransactionsState = (state) => state;

export const selectTransactionsData = createSelector(
  selectTransactionsState,
  state => state.transactions.list
);

export const selectIsDataLoaded = createSelector(
  selectTransactionsState,
  state => state.transactions.transactionsDataLoaded
);

export const selectIsDataLoadedAfterAction = createSelector(
  selectTransactionsState,
  state => state.transactions.transactionsDataLoadedAfterAction
);

export const selectCurrentTransaction = createSelector(
  selectTransactionsState,
  state => state.transactions.currentTransaction
);

export const selectIsSpinnerStarted = createSelector(
  selectTransactionsState,
  state => state.transactions.spinnerStarted
);

export const selectIsDeleteSpinnerStarted = createSelector(
  selectTransactionsState,
  state => state.transactions.deleteSpinnerStarted
);

export const selectIsCsvSpinnerStarted = createSelector(
  selectTransactionsState,
  state => state.transactions.csvSpinnerStarted
);

export const selectCsvText = createSelector(
  selectTransactionsState,
  state => state.transactions.csvText
);

export const selectTransactionLedgerItemsList = createSelector(
  selectTransactionsState,
  state => state.transactions.transactionLedgerItemsList
);

export const selectIsLedgerItemsLoading = createSelector(
  selectTransactionsState,
  state => state.transactions.ledgerItemsLoading
);

export const selectImportTransactionSpinner = createSelector(
  selectTransactionsState,
  state => state.transactions.importTransactionsSpinner
);

