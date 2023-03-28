/** Job Response */
import { PriceBookItemModel } from './price-book.interface';
import { ClientModel } from './clients.interface';

export interface JobModel {
  billTo: string;
  clientId: string;
  startDate: string;
  endDate: string;
  details: string;
  id: string;
  name: string;
  reference: string;
  status: string;
  amount: number;
  client?: ClientModel;
}

/** Job Request */
export interface AddJobDto {
  name: string;
  billTo: string;
  reference: string;
  clientId: string;
  startDate: string;
  endDate: string;
  details: string;
  status: string;
}

/** Add Charge Model */
export interface EditChargeDto {
  id: string;
  description: string;
  rate: number;
  quantity: number;
  amount: number;
  unitsString: string;
  status: string;
  date: string;
  jobId: string;
  priceBookItemId: string;
}

/** Get Charges Model */
export interface ChargeModel {
  id: string;
  description: string;
  rate: number;
  quantity: number;
  amount: number;
  unitsString: string | PriceBookItemModel;
  date: string;
  jobId: string;
  status: string;
  priceBookItemId: string;
}


