import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

import * as accountsActions from './accounts.actions';
import { AccountApiService } from '../../services/api/account-api.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { AccountActionsService } from '../../services/state/accounts/account-actions.service';
import { AccountModel } from '../../interfaces/account.interface';
import { ErrorMessageService } from '../../services/api/error-message.service';

@Injectable()
export class AccountsEffects {

  constructor(
    private actions$: Actions,
    private toastr: ToastrService,
    private router: Router,
    private accountApiService: AccountApiService,
    private accountService: AccountActionsService,
    private lSService: LocalStorageService,
    private errorMessageService: ErrorMessageService
  ) {}

  accountsData$ = createEffect(() => this.actions$.pipe(
    ofType(accountsActions.accountsData),
    switchMap(({ isDataLoadedAfterAction }) => forkJoin(
      this.accountApiService.getAccounts(this.lSService.getCurrentOrg().id),
      this.accountApiService.getAccountTypes()
    )
    .pipe(
      map(([accounts, accountTypes]) => {
        return accountsActions.accountsDataSuccess({
          data: this.accountService.touchAccounts(accounts, accountTypes),
          accountTypes,
          isDataLoadedAfterAction
        });
      }),
      catchError((error) => {
        return of(accountsActions.accountsDataFailure());
      })
    ))
  ));

  addAccount$ = createEffect(() => this.actions$.pipe(
    ofType(accountsActions.addAccount),
    switchMap(({ data }) => this.accountApiService.addAccount(data, this.lSService.getCurrentOrg().id)
      .pipe(
        map((currentAccount: AccountModel) => {
          this.toastr.success('Account Created!');
          return accountsActions.addAccountSuccess({ currentAccount });
        }),
        catchError((err) => {
          this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Account Not Created`);
          return of(accountsActions.addAccountFailure());
        })
      )
    )
  ));

  addAccountSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(accountsActions.addAccountSuccess),
    map(() => accountsActions.accountsData({ isDataLoadedAfterAction: true }))
  ));

  editAccount$ = createEffect(() => this.actions$.pipe(
    ofType(accountsActions.editAccount),
    switchMap(({ data }) => this.accountApiService.editAccount(data, this.lSService.getCurrentOrg().id)
      .pipe(
        map((currentAccount: AccountModel) => {
          this.toastr.success('Account Updated!');
          return accountsActions.editAccountSuccess({ currentAccount });
        }),
        catchError((err) => {
          this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Account Not Updated`);
          return of(accountsActions.editAccountFailure());
        })
      )
    )
  ));

  editAccountSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(accountsActions.editAccountSuccess),
    map(() => accountsActions.accountsData({ isDataLoadedAfterAction: true }))
  ));

  deleteAccount$ = createEffect(() => this.actions$.pipe(
    ofType(accountsActions.deleteAccount),
    switchMap(({ id }) => this.accountApiService.deleteAccount(id, this.lSService.getCurrentOrg().id)
      .pipe(
        map(() => {
          this.toastr.success('Account Deleted!');
          return accountsActions.deleteAccountSuccess();
        }),
        catchError((err) => {
          this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Account Not Deleted`);
          return of(accountsActions.deleteAccountFailure());
        })
      )
    )
  ));

  deleteAccountSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(accountsActions.deleteAccountSuccess),
    map(() => accountsActions.accountsData({ isDataLoadedAfterAction: true }))
  ));

}
