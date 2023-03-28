import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { LedgerItemModel } from '../../interfaces/transaction.interface';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { LogService } from '../../../shared/logger/services/log.service';
import { AddTransactionInvoiceDto, EditTransactionInvoiceDto, InvoiceModel } from '../../interfaces/invoice.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoiceApiService {
  path = environment.apiUrl + 'Invoice';

  constructor(
    private http: HttpClient,
    private lSService: LocalStorageService,
    private logger: LogService
  ) { }

  /** Get Invoices Data */
  getInvoices(): Observable<InvoiceModel[]> {
    this.logger.log('Service Call: Get Invoices');
    return this.http.get<InvoiceModel[]>(
      this.path,
      { params: { OrgId: this.lSService.getCurrentOrg().id } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Invoices')));
  }

  getInvoiceLedgerItems(invoiceId: string, orgId: string): Observable<LedgerItemModel[]> {
    this.logger.log('Service Call: Get Invoice Ledger Items');
    return this.http.get<LedgerItemModel[]>(
      this.path + '/Ledger/' + invoiceId,
      { params: { OrgId: orgId } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Invoice Ledger Items')));
  }

  getInvoiceNumber(orgId: string): Observable<string> {
    this.logger.log('Service Call: Get Invoice Number');
    return this.http.get<string>(
      this.path + '/ClaimNumber',
      { params: { OrgId: orgId } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Invoice Number')));
  }

  markAsPaid({ id, orgId, body }): Observable<InvoiceModel> {
    this.logger.log('Service Call: Invoice Mark As Paid');
    const options = body
      ? { params: { OrgId: orgId }, headers: { 'x-api-version': '1.2' } }
      : { params: {OrgId: orgId} };
    const checkedBody = body ? body : {};
    return this.http.post<InvoiceModel>(
      this.path + '/MarkAsPaid/' + id,
      checkedBody,
      options
    ).pipe(tap(() => this.logger.log('Service Call Complete: Invoice Mark As Paid')));
  }

  addInvoice(invoice: AddTransactionInvoiceDto): Observable<InvoiceModel> {
    this.logger.log('Service Call: Add Transaction Invoice');
    return this.http.post<InvoiceModel>(
      this.path,
      invoice,
      { params: { OrgId: this.lSService.getCurrentOrg().id }, headers: { 'x-api-version': '1.1' } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Add Transaction Invoice')));
  }

  editInvoice(editedInvoice: EditTransactionInvoiceDto, orgId: string): Observable<InvoiceModel> {
    this.logger.log('Service Call: Edit Transaction Invoice');
    return this.http.put<InvoiceModel>(
      this.path,
      editedInvoice,
      { params: { OrgId: orgId }, headers: { 'x-api-version': '1.2' } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Edit Transaction Invoice')));
  }

  deleteInvoice(id: string): Observable<boolean> {
    this.logger.log('Service Call: Delete Invoice');
    return this.http.delete<boolean>(
      this.path + `/${id}`,
      { params: { OrgId: this.lSService.getCurrentOrg().id }}
    ).pipe(tap(() => this.logger.log('Service Call Complete: Delete Invoice')));
  }

  approveInvoice(invoiceId: string): Observable<InvoiceModel> {
    this.logger.log('Service Call: Invoice Approve');
    return this.http.put<InvoiceModel>(
      this.path + '/Approve/' + invoiceId,
      {},
      { params: { OrgId: this.lSService.getCurrentOrg().id }, headers: { 'x-api-version': '1.2' } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Invoice Approve')));
  }

  downloadInvoice(invoiceId: string): Observable<string> {
    this.logger.log('Service Call: Get Invoice Secure Link');
    return this.http.get<string>(
      this.path + '/SecureLink/' + invoiceId,
      { params: { OrgId: this.lSService.getCurrentOrg().id } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Invoice Secure Link')));
  }

  getPdfGenerationStatus(invoiceId: string): Observable<string> {
    this.logger.log('Service Call: Get Generation Status');
    return this.http.get<string>(
      this.path + '/GenerationStatus/' + invoiceId,
      { params: { OrgId: this.lSService.getCurrentOrg().id } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Generation Status')));
  }

  generatePdf(invoiceId: string): Observable<any> {
    this.logger.log('Service Call: Generate Pdf');
    return this.http.post<any>(
      this.path + '/GeneratePdf/' + invoiceId,
      {},
      { params: { OrgId: this.lSService.getCurrentOrg().id } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Generate Pdf')));
  }
}
