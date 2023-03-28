import { Action, createReducer, on } from '@ngrx/store';

import * as financialReportsActions from './financial-reports.actions';
import { BalanceSheetModel, ProfitLossModel } from '../../interfaces/financial-reports.interfaces';

export interface IFinancialReportsState {
  balanceSheet: BalanceSheetModel;
  balanceSheetIsLoading: boolean;
  profitAndLossData: ProfitLossModel;
  profitAndLossDataLoading: boolean;
  profitAndLossDataUpdated: boolean;
  balanceSheetDataUpdated: boolean;
}

export const initialState: IFinancialReportsState = {
  balanceSheet: null,
  balanceSheetIsLoading: false,
  profitAndLossData: null,
  profitAndLossDataLoading: false,
  profitAndLossDataUpdated: false,
  balanceSheetDataUpdated: false
};

export function financialReportsReducer(state: IFinancialReportsState | undefined, action: Action): IFinancialReportsState {
  return reducer(state, action);
}

const reducer = createReducer<IFinancialReportsState>(
  initialState,

  /** Balance Sheet Data */
  on(financialReportsActions.balanceSheetData, (state: IFinancialReportsState) => ({
    ...state,
    balanceSheetIsLoading: true,
    balanceSheetDataUpdated: false
  })),

  on(financialReportsActions.balanceSheetDataSuccess, (state: IFinancialReportsState, { data }) => ({
    ...state,
    balanceSheet: data,
    balanceSheetIsLoading: false,
    balanceSheetDataUpdated: true
  })),

  on(financialReportsActions.balanceSheetDataFailure, (state: IFinancialReportsState) => ({
    ...state,
    balanceSheetIsLoading: false
  })),

  /** Profit And Loss Data */
  on(financialReportsActions.profitAndLossData, (state: IFinancialReportsState) => ({
    ...state,
    profitAndLossDataLoading: true,
    profitAndLossDataUpdated: false
  })),

  on(financialReportsActions.profitAndLossDataSuccess, (state: IFinancialReportsState, { data }) => ({
    ...state,
    profitAndLossData: data,
    profitAndLossDataLoading: false,
    profitAndLossDataUpdated: true
  })),

  on(financialReportsActions.profitAndLossDataFailure, (state: IFinancialReportsState) => ({
    ...state,
    profitAndLossDataLoading: false
  })),
);
