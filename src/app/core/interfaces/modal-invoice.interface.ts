import { InvoiceType } from '../constants/transaction.constants';
import { InvoiceModel } from './invoice.interface';

export interface ModalInvoiceData {
  title: string;
  buttonName: string;
  transactionType: InvoiceType;
  viewTransaction: (transaction: InvoiceModel) => void;
  addTransaction: () => void;
}
