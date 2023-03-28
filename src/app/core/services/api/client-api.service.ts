import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { InvoiceModel } from '../../interfaces/invoice.interface';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { LogService } from '../../../shared/logger/services/log.service';
import { TransactionModel } from '../../interfaces/transaction.interface';
import { JobModel } from '../../interfaces/job.interface';
import { AddClientDto, ClientModel } from '../../interfaces/clients.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientApiService {

  path = environment.apiUrl + 'Client';

  constructor(
    private http: HttpClient,
    private lSService: LocalStorageService,
    private logger: LogService
  ) { }

  /** Clients */
  getClients(): Observable<ClientModel[]> {
    this.logger.log('Service Call: Get Clients');
    return this.http.get<ClientModel[]>(
      this.path,
      { params: { OrgId: this.lSService.getCurrentOrg().id } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Clients')));
  }

  /** Client By Id */
  getClientById(clientId: string): Observable<ClientModel> {
    this.logger.log('Service Call: Get Client By Id');
    return this.http.get<ClientModel>(
      this.path + `/${clientId}`,
      { params: { OrgId: this.lSService.getCurrentOrg().id } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Client By Id')));
  }

  /** CRUD Client */
  addClient(addClient: AddClientDto): Observable<ClientModel> {
    this.logger.log('Service Call: Add Client');
    return this.http.post<ClientModel>(
      this.path,
      addClient,
      { params: { OrgId: this.lSService.getCurrentOrg().id } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Add Client')));
  }

  editClient(editClient: ClientModel): Observable<ClientModel> {
    this.logger.log('Service Call Made: Edit Client');
    return this.http.put<ClientModel>(
      this.path,
      editClient,
      { params: { OrgId: this.lSService.getCurrentOrg().id } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Edit Client')));
  }

  deleteClient(clientId: string) {
    this.logger.log('Service Call: Delete Client');
    return this.http.delete<any>(
      this.path + `/${clientId}`,
      { params: { OrgId: this.lSService.getCurrentOrg().id }}
    ).pipe(tap(() => this.logger.log('Service Call Complete: Delete Client')));
  }

  /** Client Jobs */
  getClientJobs(clientId: string): Observable<JobModel[]> {
    this.logger.log('Service Call: Get Client Jobs');
    return this.http.get<JobModel[]>(
      this.path + `/${clientId}/Jobs`,
      { params: { OrgId: this.lSService.getCurrentOrg().id }}
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Client Jobs')));
  }

  /** Client Invoices */
  getClientInvoices(clientId: string): Observable<TransactionModel[]> {
    this.logger.log('Service Call: Get Client Invoices');
    return this.http.get<TransactionModel[]>(
      this.path + `/${clientId}/Invoices`,
      { params: { OrgId : this.lSService.getCurrentOrg().id }}
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Client Invoices')));
  }
}
