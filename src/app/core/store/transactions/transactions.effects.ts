import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as transactionsActions from './transactions.actions';
import * as assetsActions from '../asset/asset.actions';
import { TransactionsApiService } from '../../services/api/transactions-api.service';
import { LedgerItemModel, TransactionModel } from '../../interfaces/transaction.interface';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { InvoiceApiService } from '../../services/api/invoice-api.service';
import { TransactionType } from '../../constants/transaction.constants';
import { ErrorMessageService } from '../../services/api/error-message.service';

@Injectable()
export class TransactionsEffects {

  constructor(
    private actions$: Actions,
    private toastr: ToastrService,
    private router: Router,
    private transactionsApiService: TransactionsApiService,
    private invoiceApiService: InvoiceApiService,
    private lSService: LocalStorageService,
    private errorMessageService: ErrorMessageService
  ) {
  }

  /** Get Transactions */
  transactionsData$ = createEffect(() => this.actions$.pipe(
    ofType(transactionsActions.transactionsData),
    switchMap(() => this.transactionsApiService.getTransactions(this.lSService.getCurrentOrg().id).pipe(
      map((data: TransactionModel[]) => transactionsActions.transactionsDataSuccess({data})),
      catchError((error) => of(transactionsActions.transactionsDataFailure()))
    ))
  ));

  /** CRUD Transactions */
  addTransaction$ = createEffect(() => this.actions$.pipe(
    ofType(transactionsActions.addTransaction),
    switchMap(({transaction, hasAssetAccount}) =>
      this.transactionsApiService.addTransaction(transaction, this.lSService.getCurrentOrg().id).pipe(
        map((transactionResponse: TransactionModel) => {
          transaction.type === TransactionType.ManualLedger
            ? this.toastr.success('Manual Ledgers Created!')
            : this.toastr.success('Transaction Created!');
          return transactionsActions.addTransactionSuccess({transaction: transactionResponse, hasAssetAccount});
        }),
        catchError((err) => {
          if (transaction.type === TransactionType.ManualLedger) {
            this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Manual Ledgers Not Revoked`);
          } else {
            this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Transaction Not Revoked`);
          }
          return of(transactionsActions.addTransactionFailure());
        }),
      )
    )
  ));

  addTransactionSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(transactionsActions.addTransactionSuccess),
    switchMap(({hasAssetAccount}) =>
      hasAssetAccount
        ? [transactionsActions.transactionsData(), assetsActions.assetData()]
        : [transactionsActions.transactionsData()]
    )
  ));

  editTransaction$ = createEffect(() => this.actions$.pipe(
    ofType(transactionsActions.editTransaction),
    switchMap(({data, hasAssetAccount}) => this.transactionsApiService.editTransaction(data, this.lSService.getCurrentOrg().id).pipe(
      map((transactionResponse: TransactionModel) => {
        data.type === TransactionType.ManualLedger
          ? this.toastr.success('Manual Ledgers Updated!')
          : this.toastr.success('Transaction Updated!');
        return transactionsActions.editTransactionSuccess({transaction: transactionResponse, hasAssetAccount});
      }),
      catchError((err) => {
        if (data.type === TransactionType.ManualLedger) {
          this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Manual Ledgers Not Updated`);
        } else {
          this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Transaction Not Updated`);
        }
        return of(transactionsActions.editTransactionFailure());
      }),
    ))
  ));

  editTransactionLedgerEntries$ = createEffect(() => this.actions$.pipe(
    ofType(transactionsActions.editTransactionLedgerEntries),
    switchMap(({data}) => this.transactionsApiService.editTransactionLedgerEntries(data, this.lSService.getCurrentOrg().id).pipe(
      map((transactionResponse: TransactionModel) => {
        this.toastr.success('Transaction Updated!');
        return transactionsActions.editTransactionSuccess({transaction: transactionResponse});
      }),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Transaction Not Updated`);
        return of(transactionsActions.editTransactionFailure());
      }),
    ))
  ));

  editTransactionSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(transactionsActions.editTransactionSuccess),
    switchMap(({hasAssetAccount}) =>
      hasAssetAccount
        ? [transactionsActions.transactionsData(), assetsActions.assetData()]
        : [transactionsActions.transactionsData()]
    )
  ));

  deleteTransaction$ = createEffect(() => this.actions$.pipe(
    ofType(transactionsActions.deleteTransaction),
    switchMap(({id}) => this.transactionsApiService.deleteTransaction(id, this.lSService.getCurrentOrg().id).pipe(
      map(() => {
        this.toastr.success('Transaction Deleted!');
        return transactionsActions.deleteTransactionSuccess();
      }),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Transaction Not Deleted`);
        return of(transactionsActions.deleteTransactionFailure());
      })
    ))
  ));

  deleteTransactionSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(transactionsActions.deleteTransactionSuccess),
    map(() => transactionsActions.transactionsData())
  ));

  /** Export Transactions */
  exportTransactions$ = createEffect(() => this.actions$.pipe(
    ofType(transactionsActions.exportTransactions),
    switchMap(() => this.transactionsApiService.exportTransactions(this.lSService.getCurrentOrg().id).pipe(
      map((csvText: string) => {
        return transactionsActions.exportTransactionsSuccess({csvText});
      }),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Transaction Not Exported`);
        return of(transactionsActions.exportTransactionsFailure());
      }),
    ))
  ));

  /** Get Transaction Ledger Items */
  transactionLedgerItems$ = createEffect(() => this.actions$.pipe(
    ofType(transactionsActions.transactionLedgerItems),
    switchMap(({transactionId}) => this.transactionsApiService.getTransactionLedgerItems(transactionId, this.lSService.getCurrentOrg().id)
      .pipe(
        map((data: LedgerItemModel[]) => transactionsActions.transactionLedgerItemsSuccess({data})),
        catchError(() => of(transactionsActions.transactionLedgerItemsFailure()))
      )
    )
  ));

  /** Import Transactions */
  importTransactions$ = createEffect(() => this.actions$.pipe(
    ofType(transactionsActions.importTransactions),
    switchMap(({file}) => this.transactionsApiService.importTransactions(file, this.lSService.getCurrentOrg().id).pipe(
      map(() => {
        this.toastr.success('Successfully imported transactions');
        return transactionsActions.importTransactionsSuccess();
      }),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Transaction Not Imported`);
        return of(transactionsActions.importTransactionsFailure());
      })
    ))
  ));
}
