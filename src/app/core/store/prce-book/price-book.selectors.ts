import { createSelector } from '@ngrx/store';
import { selectClientsState } from '../clients/clients.selectors';

export const selectTransactionsState = (state) => state;

export const selectClientPriceBook = createSelector(
  selectTransactionsState,
  state => state.priceBook.clientPriceBook
);

export const selectQuickAddPriceBook = createSelector(
  selectTransactionsState,
  state => state.priceBook.quickAddPriceBook
);

export const selectOrgPriceBook = createSelector(
  selectTransactionsState,
  state => state.priceBook.orgPriceBook
);

export const selectIsLoadAfterAction = createSelector(
  selectClientsState,
  state => state.priceBook.loadAfterAction
);

export const selectDataIsLoading = createSelector(
  selectTransactionsState,
  state => state.priceBook.dataIsLoading
);

export const selectSpinner = createSelector(
  selectTransactionsState,
  state => state.priceBook.spinner
);


