export interface AssetModel {
  id: string;
  categoryAccountId: string;
  name: string;
  status: string;
  identifier: string;
  bookValue: number;
  depreciatedTo: string;
  dateAcquired: string;
  acquisitionType: string;
  valueAtAcquisition: number;
  depreciationMethod: string;
  effectiveLife: number;
  depreciationRate: number;
  transactionId: string;
  residualValue: number;
}
