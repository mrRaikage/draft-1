import { createSelector } from '@ngrx/store';

export const selectClientsState = (state) => state;

export const selectClients = createSelector(
  selectClientsState,
  state => state.clients.clients
);

export const selectClient = createSelector(
  selectClientsState,
  state => state.clients.client
);

export const selectClientJobs = createSelector(
  selectClientsState,
  state => state.clients.clientJobs
);

export const selectClientInvoices = createSelector(
  selectClientsState,
  state => state.clients.clientInvoices
);

export const selectIsDataLoading = createSelector(
  selectClientsState,
  state => state.clients.dataIsLoading
);

export const selectIsModalDataLoading = createSelector(
  selectClientsState,
  state => state.clients.modalDataIsLoading
);

export const selectIsLoadAfterAction = createSelector(
  selectClientsState,
  state => state.clients.loadAfterAction
);

export const selectSpinner = createSelector(
  selectClientsState,
  state => state.clients.spinner
);

export const selectSecondarySpinner = createSelector(
  selectClientsState,
  state => state.clients.secondarySpinner
);
