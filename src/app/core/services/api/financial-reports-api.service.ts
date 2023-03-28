import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { BalanceSheetModel, ProfitLossModel } from '../../interfaces/financial-reports.interfaces';
import { LogService } from '../../../shared/logger/services/log.service';

@Injectable({
  providedIn: 'root'
})
export class FinancialReportsApiService {
  path = environment.apiUrl + 'Report';

  constructor(
    private http: HttpClient,
    private logger: LogService
  ) { }

  getBalanceSheet(date: string, orgId: string): Observable<BalanceSheetModel> {
    this.logger.log('Service Call: Get Balance Sheet');
    return this.http.get<BalanceSheetModel>(
      this.path + '/BalanceSheet',
      { params: { OrgId: orgId, Date: date } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Balance Sheet')));
  }

  getProfitAndLossReport(from: string, to: string, orgId: string): Observable<ProfitLossModel> {
    this.logger.log('Service Call: Get Profit And Loss');
    return this.http.get<ProfitLossModel>(
      this.path + '/Profitandloss',
      { params: { OrgId: orgId, from, to } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Profit And Loss')));
  }
}
