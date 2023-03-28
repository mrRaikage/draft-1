import { createAction, props } from '@ngrx/store';
import { RevenueAndExpensesChartModel } from '../../interfaces/dashboard.interface';

/** Revenue and Expenses chart Data */
export const revenueAndExpensesChartData = createAction('[Dashboard] Revenue and Expenses chart Data');
export const revenueAndExpensesChartDataSuccess = createAction('[Dashboard] Revenue and Expenses chart Data Success', props<{ data: RevenueAndExpensesChartModel }>());
export const revenueAndExpensesChartDataFailure = createAction('[Dashboard] Revenue and Expenses chart Data Failure');
