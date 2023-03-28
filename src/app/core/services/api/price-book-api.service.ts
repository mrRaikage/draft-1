import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { LogService } from '../../../shared/logger/services/log.service';
import { AddPriceBookDto, PriceBookItemModel } from '../../interfaces/price-book.interface';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PriceBookApiService {

  orgPath = environment.apiUrl + 'Org';
  clientPath = environment.apiUrl + 'Client';

  constructor(
    private http: HttpClient,
    private logger: LogService,
    private lSService: LocalStorageService
  ) { }

  /** Client Price Book */
  getClientPriceBook(clientId: string): Observable<PriceBookItemModel[]> {
    this.logger.log('Service Call: Get Client Price Book');
    return this.http.get<PriceBookItemModel[]>(
      this.clientPath + `/${clientId}/Pricebook/`,
      { params : { OrgId: this.lSService.getCurrentOrg().id } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Client Price Book')));
  }

  /** Edit Client Price Book */
  editClientPriceBook(clientPriceBook: PriceBookItemModel[], clientId: string): Observable<PriceBookItemModel[]>{
    this.logger.log('Service Call: Edit Client Price Book');
    return this.http.put<PriceBookItemModel[]>(
      this.clientPath + `/${clientId}/Pricebook/`,
      clientPriceBook,
      { params: { OrgId: this.lSService.getCurrentOrg().id }}
    ).pipe(tap(() => this.logger.log('Service Call Complete: Edit Client Price Book')));
  }

  /** Add Client Price Book */
  addClientPriceBook(clientPriceBook: AddPriceBookDto, clientId: string): Observable<PriceBookItemModel>{
    this.logger.log('Service Call: Add Client Price Book');
    return this.http.post<PriceBookItemModel>(
      this.clientPath + `/${clientId}/Pricebook/`,
      clientPriceBook,
      { params: { OrgId: this.lSService.getCurrentOrg().id }}
    ).pipe(tap(() => this.logger.log('Service Call Complete: Add Client Price Book')));
  }

  /** Organization Price Book */
  getOrganizationPriceBook(): Observable<PriceBookItemModel[]> {
    this.logger.log('Service Call: Get Organization Price Book');
    return this.http.get<PriceBookItemModel[]>(
      this.orgPath + `/Pricebook/`,
      { params : { OrgId: this.lSService.getCurrentOrg().id } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Organization Price Book')));
  }

  /** Edit Organization Price Book */
  editOrganizationPriceBook(organizationPriceBook: PriceBookItemModel[]): Observable<PriceBookItemModel[]>{
    this.logger.log('Service Call: Edit Organization Price Book');
    return this.http.put<PriceBookItemModel[]>(
      this.orgPath + `/Pricebook/`,
      organizationPriceBook,
      { params: { OrgId: this.lSService.getCurrentOrg().id }}
    ).pipe(tap(() => this.logger.log('Service Call Complete: Edit Organization Price Book')));
  }

  /** Add Org Price Book */
  addOrganizationPriceBook(orgPriceBook: AddPriceBookDto): Observable<PriceBookItemModel>{
    this.logger.log('Service Call: Add Organization Price Book');
    return this.http.post<PriceBookItemModel>(
      this.orgPath + `/Pricebook/`,
      orgPriceBook,
      { params: { OrgId: this.lSService.getCurrentOrg().id }}
    ).pipe(tap(() => this.logger.log('Service Call Complete: Add Organization Price Book')));
  }

}
