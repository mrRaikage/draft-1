import { createSelector } from '@ngrx/store';

export const selectAssetState = (state) => state;

export const selectBankFeedsData = createSelector(
  selectAssetState,
  state => state.bankFeeds.list
);

export const selectIsDataLoaded = createSelector(
  selectAssetState,
  state => state.bankFeeds.bankFeedsDataLoaded
);

export const selectIsDataLoadedAfterAction = createSelector(
  selectAssetState,
  state => state.bankFeeds.bankFeedsDataLoadedAfterAction
);

export const selectCurrentAsset = createSelector(
  selectAssetState,
  state => state.bankFeeds.currentBankFeed
);

export const selectIsSpinnerStarted = createSelector(
  selectAssetState,
  state => state.bankFeeds.spinnerStarted
);
