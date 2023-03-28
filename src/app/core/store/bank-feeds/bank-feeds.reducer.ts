import { Action, createReducer, on } from '@ngrx/store';

import * as bankFeedsActions from './bank-feeds.actions';
import { BankFeedsModel } from '../../interfaces/bank-feeds.interface';

export interface IBankFeedsState {
  list: BankFeedsModel[];
  currentBankFeed: BankFeedsModel;
  bankFeedsDataLoaded: boolean;
  bankFeedsDataLoadedAfterAction: boolean;
  spinnerStarted: boolean;
}

export const initialState: IBankFeedsState = {
  list: null,
  currentBankFeed: null,
  bankFeedsDataLoaded: null,
  bankFeedsDataLoadedAfterAction: null,
  spinnerStarted: null
};

export function bankFeedsReducer(state: IBankFeedsState | undefined, action: Action): IBankFeedsState {
  return reducer(state, action);
}

const reducer = createReducer<IBankFeedsState>(
  initialState,

  /** Get Bank Feeds */
  on(bankFeedsActions.getBankFeeds, state => ({
      ...state,
      bankFeedsDataLoaded: false
    })
  ),

  on(bankFeedsActions.getBankFeedsSuccess, (state, { data }) => ({
      ...state,
      list: data,
      bankFeedsDataLoaded: true,
      bankFeedsDataLoadedAfterAction: true,
      spinnerStarted: false
    })
  ),

  /** Import Bank Feeds */
  on(bankFeedsActions.importBankFeeds, state => ({
      ...state,
      spinnerStarted: true
    })
  ),

  on(bankFeedsActions.importBankFeedsSuccess, (state, { data }) => ({
      ...state,
      spinnerStarted: false
    })
  )
);
