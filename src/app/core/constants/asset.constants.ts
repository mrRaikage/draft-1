import { ISelectListItem } from '../../shared/interfaces/select-control.interface';

export const assetTableColumn: string[] = [
  'category',
  'name',
  'status',
  'identifier',
  'dateAcquired',
  'bookValue'
];

export enum DepreciationMethods {
  DiminishingValue = 'DV',
  StraightLine = 'SL'
}

export const depreciationMethods: { [key: string]: ISelectListItem<DepreciationMethods> } = {
  DiminishingValue: {
    displayName: 'Diminishing Value',
    value: DepreciationMethods.DiminishingValue,
  },
  StraightLine: {
    displayName: 'Straight Line',
    value: DepreciationMethods.StraightLine,
  }
};
