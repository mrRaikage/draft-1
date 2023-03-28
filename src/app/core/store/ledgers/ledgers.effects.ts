import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

import * as ledgerActions from './ledgers.actions';

import { LedgerApiService } from '../../../services/api/ledger-api.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

@Injectable()

export class LedgersEffects {

  constructor(
    private actions$: Actions,
    private lSService: LocalStorageService,
    private ledgersService: LedgerApiService,
    private toastr: ToastrService,
  ) {
  }

  getLedgerData$ = createEffect( () => this.actions$.pipe(
    ofType(ledgerActions.filterLedgersData),
    switchMap(({ params, url }) => this.ledgersService.getLedgerByParams(this.lSService.getCurrentOrg().id, params, url).pipe(
      map(ledgersData => {
        return ledgerActions.filterLedgersDataSuccess({ ledgersData });
      }),
      catchError(err => {
        this.toastr.error('Ledgers Error');
        return of (ledgerActions.filterLedgersDataFailure());
      })
    )),
  ));
}
