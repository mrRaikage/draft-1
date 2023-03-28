import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { FinancialReportsApiService } from '../../services/api/financial-reports-api.service';
import * as financialReportsActions from './financial-reports.actions';
import { BalanceSheetModel, ProfitLossModel } from '../../interfaces/financial-reports.interfaces';

@Injectable()
export class FinancialReportsEffects {

  constructor(
    private actions$: Actions,
    private toastr: ToastrService,
    private financialReportsApiService: FinancialReportsApiService,
    private lSService: LocalStorageService
  ) {}

  balanceSheetData$ = createEffect(() => this.actions$.pipe(
    ofType(financialReportsActions.balanceSheetData),
    switchMap(({ date }) => this.financialReportsApiService.getBalanceSheet(date, this.lSService.getCurrentOrg().id)
      .pipe(
        map((data: BalanceSheetModel) => financialReportsActions.balanceSheetDataSuccess({ data })),
        catchError(() => {
          return of(financialReportsActions.balanceSheetDataFailure());
        })
      )
    )
  ));

  profitAndLossData$ = createEffect(() => this.actions$.pipe(
    ofType(financialReportsActions.profitAndLossData),
    switchMap(({ from, to }) => this.financialReportsApiService.getProfitAndLossReport(from, to, this.lSService.getCurrentOrg().id)
      .pipe(
        map((data: ProfitLossModel) => financialReportsActions.profitAndLossDataSuccess({ data })),
        catchError(() => of(financialReportsActions.profitAndLossDataFailure()))
      )
    )
  ));
}
