import { createSelector } from '@ngrx/store';

export const selectFinancialReportsState = (state) => state;

export const selectBalanceSheetData = createSelector(
  selectFinancialReportsState,
  state => state.financialReports.balanceSheet
);

export const selectBalanceSheetIsLoading = createSelector(
  selectFinancialReportsState,
  state => state.financialReports.balanceSheetIsLoading
);

export const selectProfitLossData = createSelector(
  selectFinancialReportsState,
  state => state.financialReports.profitAndLossData
);

export const selectProfitLossIsLoading = createSelector(
  selectFinancialReportsState,
  state => state.financialReports.profitAndLossDataLoading
);

export const selectProfitLossIsUpdated = createSelector(
  selectFinancialReportsState,
  state => state.financialReports.profitAndLossDataUpdated
);

export const selectBalanceSheetIsUpdated = createSelector(
  selectFinancialReportsState,
  state => state.financialReports.balanceSheetDataUpdated
);


