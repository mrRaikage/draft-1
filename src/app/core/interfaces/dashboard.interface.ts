export interface RevenueAndExpensesChartModel {
  min: number;
  max: number;
  expensesData: { [key: string]: number };
  revenueData: { [key: string]: number };
}

