import { createAction, props } from '@ngrx/store';
import { AssetModel } from '../../interfaces/asset.interface';

/** Get Asset Data */
export const assetData = createAction('[Asset] Asset Data');
export const assetDataSuccess = createAction('[Asset] Asset Data Success', props<{ data: AssetModel[] }>());
export const assetDataFailure = createAction('[Asset] Asset Data Failure');

/** Edit Asset Data */
export const editAsset = createAction('[Asset] Edit Asset', props<{ data: AssetModel }>());
export const editAssetSuccess = createAction('[Asset] Edit Asset Success', props<{ asset: AssetModel }>());
export const editAssetFailure = createAction('[Asset] Edit Asset Failure');
