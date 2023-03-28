import * as moment from 'moment';
import {
  AddInvoiceDto,
  AddInvoiceLineDto,
  EditInvoiceDto, InvoiceLineDto,
  InvoiceLineModel,
  InvoiceModel
} from '../interfaces/invoice.interface';

export const mapAddInvoiceModelToDto = (
  model: InvoiceModel
): AddInvoiceDto => ({
  party: model.party,
  ref: model.ref,
  jobId: model.jobId,
  clientId: model.clientId,
  status: model.status,
  billTo: model.billTo,
  type: model.type,
  number: model.number,
  paidDate: model.paidDate ? moment(model.paidDate).format('YYYY-MM-DD') : null,
  date: moment(model.date).format('YYYY-MM-DD'),
  paidIntoAccountId: model.paidIntoAccountId,
  generationStatus: model.generationStatus,
  details: model.details,
  amount: model.amount,
  subtotal: model.subtotal,
  tax: model.tax,
  taxMode: model.taxMode,
  dueDate: model.dueDate ? moment(model.dueDate).format('YYYY-MM-DD') : null,
  invoiceLines: model.invoiceLines
    ? model.invoiceLines.map((line: InvoiceLineModel) => mapAddInvoiceLinesModelToDto(line))
    : null
});

export const mapEditInvoiceModelToDto = (
  model: InvoiceModel
): EditInvoiceDto => ({
  party: model.party,
  ref: model.ref,
  jobId: model.jobId,
  clientId: model.clientId,
  status: model.status,
  id: model.id,
  billTo: model.billTo,
  type: model.type,
  number: model.number,
  date: moment(model.date).format('YYYY-MM-DD'),
  generationStatus: model.generationStatus,
  details: model.details,
  amount: model.amount,
  subtotal: model.subtotal,
  tax: model.tax,
  taxMode: model.taxMode,
  dueDate: model.dueDate ? moment(model.dueDate).format('YYYY-MM-DD') : null,
  invoiceLines: model.invoiceLines
    ? model.invoiceLines.map((line: InvoiceLineModel) => mapEditInvoiceLinesModelToDto(line))
    : null,
  paidDate: model.paidDate ? moment(model.paidDate).format('YYYY-MM-DD') : null,
  paidIntoAccountId: model.paidIntoAccountId
});

export const mapAddInvoiceLinesModelToDto = (
  model: InvoiceLineModel
): AddInvoiceLineDto => ({
  description: model.description,
  unitsString: model.unitsString as string,
  quantity: model.quantity,
  rate: model.rate,
  taxRate: model.taxRate,
  amount: model.amount,
  accountId: model.account.id,
  chargeIds: model.chargeIds,
  date: moment(model.date).format('YYYY-MM-DD'),
});

export const mapEditInvoiceLinesModelToDto = (
  model: InvoiceLineModel
): InvoiceLineDto => ({
  id: model.id,
  description: model.description,
  quantity: model.quantity,
  rate: model.rate,
  taxRate: model.taxRate,
  amount: model.amount,
  accountId: model.accountId ? model.accountId : model.account.id,
  unitsString: model.unitsString as string,
  chargeIds: model.chargeIds,
  date: moment(model.date).format('YYYY-MM-DD'),
});
