import { createSelector } from '@ngrx/store';

export const selectLedgersState = (state) => state.ledgers;

export const selectLedgersData = createSelector(
  selectLedgersState,
  state => state.ledgersData
);

export const selectIsDataLoaded = createSelector(
  selectLedgersState,
  state => state.ledgersDataLoaded
);

export const selectApplySpinner = createSelector(
  selectLedgersState,
  state => state.spinner
);
