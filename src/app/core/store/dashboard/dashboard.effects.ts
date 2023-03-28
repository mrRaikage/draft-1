import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as  dashboardActions from './dashboard.actions';
import { RevenueAndExpensesChartModel } from '../../interfaces/dashboard.interface';
import { DashboardApiService } from '../../services/api/dashboard-api.service';

@Injectable()
export class DashboardEffects {
  constructor(
    private actions$: Actions,
    private dashboardApiService: DashboardApiService
  ) {
  }

  /** Revenue and Expenses chart Data */
  chartData$ = createEffect(() => this.actions$.pipe(
    ofType(dashboardActions.revenueAndExpensesChartData),
    switchMap(() => this.dashboardApiService.getRevenueAndExpensesChartData().pipe(
      map((data: RevenueAndExpensesChartModel) => dashboardActions.revenueAndExpensesChartDataSuccess({ data })),
      catchError(() => of(dashboardActions.revenueAndExpensesChartDataFailure()))
    ))
  ));

}
