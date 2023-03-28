export interface OrganizationModel {
  id: string;
  name?: string;
  createdBy?: string;
  settings?: OrganizationSettingsModel;
}

export interface OrganizationUserModel {
  id: string;
  role: string;
  user: {
    email: string,
  };
}

export interface OrganizationSettingsModel {
  id: string;
  yearEndDay: number;
  yearEndMonth: number;
  taxNumber: any;
  taxRegistered: boolean;
  taxRate: number;
  invoiceFooter: any;
  invoiceAddress: any;
  invoiceTradingName: any;
  invoicePaymentTerms: any;
  invoiceDefaultTaxMode?: string;
  logoSecureLink: string;
  orgId: string;
  orgName: string;
  invoiceGroupChargesByDate: boolean;
}


