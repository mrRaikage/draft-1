/** Price Book */
export interface PriceBookItemDto {
  id: string;
  clientId: string;
  status: string;
  unit: string;
  rate: number;
  accountId: string;
  taxRate: number;
}

export interface PriceBookItemModel extends PriceBookItemDto {
  name?: string;
  code?: number;
}

export interface AddPriceBookDto {
  unit: string;
  rate: number;
  accountId: string;
  clientId: string;
  status: string;
}
