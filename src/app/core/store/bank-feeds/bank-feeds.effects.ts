import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { BankFeedsModel } from '../../interfaces/bank-feeds.interface';
import { BankFeedsApiService } from '../../services/api/bank-feeds-api.service';
import * as bankFeedsActions from './bank-feeds.actions';

@Injectable()
export class BankFeedsEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private bankFeedsApiService: BankFeedsApiService,
    private lSService: LocalStorageService
  ) {}

  /** Get Bank Feeds */
  getBankFeeds$ = createEffect(() => this.actions$.pipe(
    ofType(bankFeedsActions.getBankFeeds),
    switchMap(() => this.bankFeedsApiService.getBankFeeds(this.lSService.getCurrentOrg().id)
      .pipe(
        map((data: BankFeedsModel[]) => bankFeedsActions.getBankFeedsSuccess({ data })),
        catchError((error) => of(bankFeedsActions.getBankFeedsFailure()))
      )
    )
  ));

  /** Import Bank Feeds */
  importBankFeeds$ = createEffect(() => this.actions$.pipe(
    ofType(bankFeedsActions.importBankFeeds),
    switchMap(({file}) => this.bankFeedsApiService.importBankFeeds(file, this.lSService.getCurrentOrg().id)
      .pipe(
        map((data) => bankFeedsActions.importBankFeedsSuccess({ data })),
        catchError((error) => of(bankFeedsActions.importBankFeedsFailure()))
      )
    )
  ));
}
