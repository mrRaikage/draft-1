import { InvoiceModel } from '../interfaces/invoice.interface';

export const invoicesTableColumn: string[] = [
  'date',
  'number',
  'party',
  'amount',
  'status',
  'paidDate',
  'more'
];

export const emptyInvoice: InvoiceModel = {
  invoiceLines: [{
    amount: null,
    description: null,
    taxRate: null,
    quantity: null,
    units: null,
    unitsString: null,
    rate: null,
    accountId: null,
    chargeIds: null,
    date: null,
    id: null
  }],
  dueDate: null,
  id: null,
  number: null,
  status: null,
  billTo: null,
  type: null,
  paidDate: null,
  date: null,
  paidIntoAccountId: null,
  jobId: null,
  clientId: null,
  generationStatus: null,
  details: null,
  amount: null,
  subtotal: null,
  tax: null,
  taxMode: null,
  party: null,
  ref: null,
  hasManualLedger: null
};

