import { createAction, props } from '@ngrx/store';
import { BalanceSheetModel, ProfitLossModel } from '../../interfaces/financial-reports.interfaces';

/** Get Balance Sheet */
export const balanceSheetData = createAction('[Financial Reports] Balance Sheet Data', props<{ date: string }>());
export const balanceSheetDataSuccess = createAction('[Financial Reports] Balance Sheet Data Success', props<{ data: BalanceSheetModel }>());
export const balanceSheetDataFailure = createAction('[Financial Reports] Balance Sheet Data Failure');

/** Get Profit Loss */
export const profitAndLossData = createAction('[Financial Reports] Profit And Loss Data', props<{ from: string, to: string }>());
export const profitAndLossDataSuccess = createAction('[Financial Reports] Profit And Loss Data Success', props<{
  data: ProfitLossModel
}>()
);
export const profitAndLossDataFailure = createAction('[Financial Reports] Profit And Loss Data Failure');


