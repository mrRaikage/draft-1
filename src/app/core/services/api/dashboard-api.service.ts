import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/logger/services/log.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { RevenueAndExpensesChartModel } from '../../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardApiService {

  path = environment.apiUrl + 'dashboard/data/';

  constructor(
    private http: HttpClient,
    private lSService: LocalStorageService,
    private logger: LogService
  ) { }

  /** Revenue and Expenses Chart Data */
  getRevenueAndExpensesChartData(): Observable<RevenueAndExpensesChartModel> {
    this.logger.log('Service Call: Get Revenue and Expenses Chart Data');
    return this.http.get<RevenueAndExpensesChartModel>(
      this.path + 'RevExpense',
      { params: { OrgId: this.lSService.getCurrentOrg().id } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Revenue and Expenses Chart Data')));
  }

}
