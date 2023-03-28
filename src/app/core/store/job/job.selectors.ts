import { createSelector } from '@ngrx/store';

export const selectJobState = (state) => state;

export const selectJobData = createSelector(
  selectJobState,
  state => state.jobs.list
);

export const selectIsDataLoadedAfterAction = createSelector(
  selectJobState,
  state => state.jobs.isDataLoadedAfterAction
);

export const selectSpinner = createSelector(
  selectJobState,
  state => state.jobs.spinner
);

export const selectDeleteSpinner = createSelector(
  selectJobState,
  state => state.jobs.deleteSpinner
);

export const selectCurrentJob = createSelector(
  selectJobState,
  state => state.jobs.currentJob
);

export const selectIsJobsLoaded = createSelector(
  selectJobState,
  state => state.jobs.isJobsLoaded
);

export const selectModalDataIsLoading = createSelector(
  selectJobState,
  state => state.jobs.modalDataIsLoading
);

export const selectIsChargesLoading = createSelector(
  selectJobState,
  state => state.jobs.isChargesLoading
);

export const selectListOfCharges = createSelector(
  selectJobState,
  state => state.jobs.listOfCharges
);

export const selectJobInvoice = createSelector(
  selectJobState,
  state => state.jobs.jobInvoice
);

export const selectJobInvoicesList = createSelector(
  selectJobState,
  state => state.jobs.jobInvoicesList
);
