import { ISelectListItem } from '../../shared/interfaces/select-control.interface';

export const paymentTermsList: ISelectListItem<number>[] = [
  {
    displayName: '100 Days',
    value: 100
  },
  {
    displayName: '50 Days',
    value: 50
  },
  {
    displayName: '30 Days',
    value: 30
  },
  {
    displayName: '20 Days',
    value: 20
  },
  {
    displayName: '10 Days',
    value: 10
  },
  {
    displayName: '5 Days',
    value: 5
  },
  {
    displayName: 'Not Selected',
    value: 0
  }
];
