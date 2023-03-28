import { Action, createReducer, on } from '@ngrx/store';

import * as assetActions from './asset.actions';

import { AssetModel } from '../../interfaces/asset.interface';

export interface IAssetState {
  list: AssetModel[];
  currentAsset: AssetModel;
  assetDataLoaded: boolean;
  assetDataLoadedAfterAction: boolean;
  spinnerStarted: boolean;
}

export const initialState: IAssetState = {
  list: null,
  currentAsset: null,
  assetDataLoaded: null,
  assetDataLoadedAfterAction: null,
  spinnerStarted: null
};

export function assetReducer(state: IAssetState | undefined, action: Action): IAssetState {
  return reducer(state, action);
}

const reducer = createReducer<IAssetState>(
  initialState,

  /** Get Assets */
  on(assetActions.assetData, state => ({
      ...state,
      assetDataLoaded: false
    })
  ),

  on(assetActions.assetDataSuccess, (state, { data }) => ({
      ...state,
      list: data,
      assetDataLoaded: true,
      assetDataLoadedAfterAction: true,
      spinnerStarted: false
    })
  ),

  on(assetActions.editAsset, state => ({
      ...state,
      currentAsset: null,
      assetDataLoadedAfterAction: false,
      spinnerStarted: true
    })
  ),

  on(assetActions.editAssetSuccess, (state, { asset }) => ({
      ...state,
      currentAsset: asset
    })
  )
);
