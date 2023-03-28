import { createSelector } from '@ngrx/store';

export const selectDashboardState = (state) => state.dashboard;

export const selectRevenueAndExpensesChartData = createSelector(
  selectDashboardState,
  state => state.revenueAndExpensesChartData
);
