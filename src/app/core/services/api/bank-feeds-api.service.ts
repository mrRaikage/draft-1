import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/logger/services/log.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { BankFeedsModel } from '../../interfaces/bank-feeds.interface';

@Injectable({
  providedIn: 'root'
})
export class BankFeedsApiService {
  path = environment.apiUrl + 'BankFeeds';

  constructor(
    private http: HttpClient,
    private lSService: LocalStorageService,
    private logger: LogService
  ) {}

  getBankFeeds(orgId: string): Observable<BankFeedsModel[]> {
    this.logger.log('Service Call: Get Bank Feeds');
    return this.http.get<BankFeedsModel[]>(
      this.path,
      { params: { OrgId: orgId } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Bank Feeds')));
  }

  importBankFeeds(file: FormData, orgId: string): Observable<any> {
    this.logger.log('Service Call: Import Bank Feeds');
    return this.http.post<any>(
      this.path + '/Import',
      file,
      { params: { OrgId: orgId } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Import Bank Feeds')));
  }
}
