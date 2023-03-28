import { Action, createReducer, on } from '@ngrx/store';
import { RevenueAndExpensesChartModel } from '../../interfaces/dashboard.interface';
import * as dashboardActions from './dashboard.actions';

export interface IDashboardState {
  revenueAndExpensesChartData: RevenueAndExpensesChartModel;
}

export const initialState: IDashboardState = {
  revenueAndExpensesChartData: null
};

export function dashboardReducer(state: IDashboardState | undefined, action: Action): IDashboardState {
  return reducer(state, action);
}

const reducer = createReducer<IDashboardState>(
  initialState,

  /** Chart Data */
  on(dashboardActions.revenueAndExpensesChartDataSuccess, (state, { data }) => ({
    ...state,
    revenueAndExpensesChartData: data
  }))
);
