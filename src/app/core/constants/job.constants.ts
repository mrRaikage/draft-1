import { ISelectListItem } from '../../shared/interfaces/select-control.interface';

export enum ChargeGroups {
  NoGrouping = 'None',
  UnitRate = 'UnitRate',
  DateUnitRate = 'DateUnitRate'
}

export enum StatusList {
  InProgress = 'In Progress',
  Completed = 'Completed'
}
export const chargeGroups: { [key: string]: ISelectListItem<ChargeGroups> } = {
  NoGrouping: {
    displayName: 'No grouping',
    value: ChargeGroups.NoGrouping,
  },
  UnitRate: {
    displayName: 'Units and Rate',
    value: ChargeGroups.UnitRate,
  },
  DateUnitRate: {
    displayName: 'Date then by Units and Rate',
    value: ChargeGroups.DateUnitRate,
  }
};

export const statusList: { [key: string]: ISelectListItem<string> } = {
  InProgress: {
    displayName: 'In Progress',
    value: StatusList.InProgress
  },
  Completed: {
  displayName: 'Completed',
    value: StatusList.Completed
}
};
