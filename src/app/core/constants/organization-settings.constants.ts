import { ISelectListItem } from '../../shared/interfaces/select-control.interface';
import { OrganizationSettingsModel } from '../interfaces/organizations.interface';

export const emptyOrgSettings: OrganizationSettingsModel = {
  id: null,
  yearEndDay: null,
  yearEndMonth: null,
  taxNumber: null,
  taxRegistered: null,
  taxRate: null,
  invoiceFooter: null,
  invoiceAddress: null,
  invoiceTradingName: null,
  invoicePaymentTerms: null,
  orgId: null,
  orgName: null,
  invoiceGroupChargesByDate: null,
  logoSecureLink: null
};

export const registeredForTaxList: ISelectListItem<boolean>[] = [
  {
    displayName: 'Yes',
    value: true,
  },
  {
    displayName: 'No',
    value: false,
  }
];

export const yearEndMonthList: ISelectListItem<number>[] = [
  { value: 0, displayName: 'Not Selected' },
  { value: 1, displayName: 'Jan' },
  { value: 2, displayName: 'Feb' },
  { value: 3, displayName: 'Mar' },
  { value: 4, displayName: 'Apr' },
  { value: 5, displayName: 'May' },
  { value: 6, displayName: 'Jun' },
  { value: 7, displayName: 'Jul' },
  { value: 8, displayName: 'Aug' },
  { value: 9, displayName: 'Sep' },
  { value: 10, displayName: 'Oct' },
  { value: 11, displayName: 'Nov' },
  { value: 12, displayName: 'Dec' }
];


