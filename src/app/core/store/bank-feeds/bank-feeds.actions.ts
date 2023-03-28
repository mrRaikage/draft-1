import { createAction, props } from '@ngrx/store';
import { BankFeedsModel } from '../../interfaces/bank-feeds.interface';

/** Get Bank Feeds */
export const getBankFeeds = createAction('[Bank Feeds] Bank Feeds Data');
export const getBankFeedsSuccess = createAction('[Bank Feeds] Bank Feeds Data Success', props<{ data: BankFeedsModel[] }>());
export const getBankFeedsFailure = createAction('[Bank Feeds] Bank Feeds Data Failure');

/** Import Bank Feeds */
export const importBankFeeds = createAction('[Bank Feeds] Import Bank Feeds', props<{ file: FormData }>());
export const importBankFeedsSuccess = createAction('[Bank Feeds] Import Bank Feeds Success', props<{ data: number }>());
export const importBankFeedsFailure = createAction('[Bank Feeds] Import Bank Feeds Failure');
