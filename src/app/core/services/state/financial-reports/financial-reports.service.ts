import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';

import { OrganizationSettingsModel } from '../../../interfaces/organizations.interface';
import {
  BALANCE_REPORT_DATE,
  INCOME_STATEMENT_PERIOD,
  LocalStorageService
} from '../../../../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FinancialReportsService {

  constructor(private lSService: LocalStorageService) { }

  setReportsDataToLS(): void {
    if (!this.lSService.hasItem(INCOME_STATEMENT_PERIOD)) {
      this.lSService.setIncomeStatementPeriod({
        from: this.getStartFinYearDate().format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
      });
    }

    if (!this.lSService.hasItem(BALANCE_REPORT_DATE)) {
      this.lSService.setBalanceReportDate({ date: moment().format('YYYY-MM-DD') });
    }
  }

  getStartFinYearDate(): Moment {
    const orgSettings: OrganizationSettingsModel = this.lSService.getCurrentOrg().settings;
    const currentDate = moment();
    const month = orgSettings?.yearEndMonth || 4;
    const day = orgSettings?.yearEndDay || 1;
    const period = moment().month(month - 1).date(day);
    const diff = period.diff(currentDate);
    return diff > 0
      ? period.subtract(1, 'years').add(1, 'days')
      : period.add(1, 'days');
  }
}
