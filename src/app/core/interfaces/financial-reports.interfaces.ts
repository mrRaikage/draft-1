export interface BalanceSheetModel {
  assets: any;
  equity: any;
  liabilities: any;
  liabilitiesEquity: any;
}

export interface ProfitLossModel {
  children: ReportItemChildModel[];
}

export interface ReportItemModel {
  children: ReportItemChildModel[];
  amount: number;
}

export interface ReportItemChildModel {
  amount: number;
  name: string;
  children?: any;
}

export interface EquityItemModel {
  name: string;
  amount: number;
}

