import { Action, createReducer, on } from '@ngrx/store';
import { LedgerDataModel } from '../../../interfaces/ledger.interface';

import * as ledgerActions from './ledgers.actions';

export interface ILedgerState {
  ledgersData: LedgerDataModel | null;
  ledgersDataLoaded: boolean;
  spinner: boolean;
}

export const initialState: ILedgerState = {
  ledgersData: null,
  ledgersDataLoaded: false,
  spinner: false
};

export function ledgerReducer(state: ILedgerState | undefined, action: Action): ILedgerState {
  return reducer(state, action);
}

const reducer = createReducer<ILedgerState>(
  initialState,

  on(ledgerActions.filterLedgersData, (state, { url }) => ({
    ...state,
    spinner: !url
  })),

  on(ledgerActions.filterLedgersDataSuccess, (state, { ledgersData }) => ({
    ...state,
    ledgersData,
    ledgersDataLoaded: true,
    spinner: false
  })),

  on(ledgerActions.filterLedgersDataFailure, state => ({
    ...state,
    spinner: false
  })),

  on(ledgerActions.clearLedgersData, state => ({
    ...initialState
  })),

);
