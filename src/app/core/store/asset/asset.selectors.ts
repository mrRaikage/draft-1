import { createSelector } from '@ngrx/store';

export const selectAssetState = (state) => state;

export const selectAssetData = createSelector(
  selectAssetState,
  state => state.asset.list
);

export const selectIsDataLoaded = createSelector(
  selectAssetState,
  state => state.asset.assetDataLoaded
);

export const selectIsDataLoadedAfterAction = createSelector(
  selectAssetState,
  state => state.asset.assetDataLoadedAfterAction
);

export const selectCurrentAsset = createSelector(
  selectAssetState,
  state => state.asset.currentAsset
);

export const selectIsSpinnerStarted = createSelector(
  selectAssetState,
  state => state.asset.spinnerStarted
);
