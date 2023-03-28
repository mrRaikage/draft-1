import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

import * as priceBookActions from './price-book.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PriceBookApiService } from '../../services/api/price-book-api.service';
import { PriceBookItemModel } from '../../interfaces/price-book.interface';

@Injectable()
export class PriceBookEffects {

  constructor(
    private actions$: Actions,
    private toastr: ToastrService,
    private priceBookApiService: PriceBookApiService
  ) {
  }

  /** Get Organization PriceBook */
  orgPriceBook$ = createEffect(() => this.actions$.pipe(
    ofType(priceBookActions.orgPriceBook),
    switchMap(() => this.priceBookApiService.getOrganizationPriceBook().pipe(
      map((priceBook: PriceBookItemModel[]) => priceBookActions.orgPriceBookSuccess({ priceBook })),
      catchError(() => of(priceBookActions.orgPriceBookFailure()))
    ))
  ));

  /** Add Org PriceBook */
  addOrgPriceBook$ = createEffect(() => this.actions$.pipe(
    ofType(priceBookActions.addOrgPriceBook),
    switchMap(({ data }) => this.priceBookApiService.addOrganizationPriceBook(data).pipe(
      map((priceBook: PriceBookItemModel) => priceBookActions.addOrgPriceBookSuccess({ quickAddPriceBook: priceBook })),
      catchError(() => of(priceBookActions.addOrgPriceBookFailure()))
    ))
  ));

  addOrgPriceBookSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(priceBookActions.addOrgPriceBookSuccess),
    map(() => priceBookActions.orgPriceBook())
  ));

  /** Edit Organization PriceBook */
  editOrgPriceBook$ = createEffect(() => this.actions$.pipe(
    ofType(priceBookActions.editOrgPriceBook),
    switchMap(({ data }) => this.priceBookApiService.editOrganizationPriceBook(data).pipe(
      map(() => priceBookActions.editOrgPriceBookSuccess()),
      catchError(() => of(priceBookActions.editOrgPriceBookFailure()))
    ))
  ));

  editOrgPriceBookSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(priceBookActions.editOrgPriceBookSuccess),
    map(() => priceBookActions.orgPriceBook())
  ));

  /** Get Client PriceBook */
  clientPriceBook$ = createEffect(() => this.actions$.pipe(
    ofType(priceBookActions.clientPriceBook),
    switchMap(({ clientId }) => this.priceBookApiService.getClientPriceBook(clientId).pipe(
      map((priceBook: PriceBookItemModel[]) => priceBookActions.clientPriceBookSuccess({ priceBook })),
      catchError(() => of(priceBookActions.clientPriceBookFailure()))
    ))
  ));

  /** Add Client PriceBook */
  addClientPriceBook$ = createEffect(() => this.actions$.pipe(
    ofType(priceBookActions.addClientPriceBook),
    switchMap(({ clientId, data }) => this.priceBookApiService.addClientPriceBook(data, clientId).pipe(
      map((priceBook: PriceBookItemModel) => priceBookActions.addClientPriceBookSuccess({ clientId, quickAddPriceBook: priceBook })),
      catchError(() => of(priceBookActions.addClientPriceBookFailure()))
    ))
  ));

  addClientPriceBookSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(priceBookActions.addClientPriceBookSuccess),
    map(({ clientId }) => priceBookActions.clientPriceBook({ clientId }))
  ));

  /** Edit Client PriceBook */
  editClientPriceBook$ = createEffect(() => this.actions$.pipe(
    ofType(priceBookActions.editClientPriceBook),
    switchMap(({ clientId, data }) => this.priceBookApiService.editClientPriceBook(data, clientId).pipe(
      map((priceBook: PriceBookItemModel[]) => priceBookActions.editClientPriceBookSuccess({ clientId })),
      catchError(() => of(priceBookActions.editClientPriceBookFailure()))
    ))
  ));

  editClientPriceBookSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(priceBookActions.editClientPriceBookSuccess),
    map(({ clientId }) => priceBookActions.clientPriceBook({ clientId }))
  ));
}
