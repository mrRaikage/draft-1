import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import {
  AddTransactionDto,
  AddTrxExpenseDto,
  EditTransactionDto,
  EditTrxExpenseDto,
  LedgerItemModel,
  ManualLedgersDto,
  TransactionLineModel,
  TransactionModel
} from '../../interfaces/transaction.interface';
import { environment } from '../../../../environments/environment';
import { sortArrayByDate } from '../../../shared/utils/functions/helper.functions';
import { LogService } from '../../../shared/logger/services/log.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsApiService {

  path = environment.apiUrl + 'Transaction';
  pathExportTransaction = environment.apiUrl + 'Export/Transactions';
  pathImportTransaction = environment.apiUrl + 'Import/Transactions';

  constructor(
    private http: HttpClient,
    private logger: LogService
  ) { }

  getTransactions(orgId: string): Observable<TransactionModel[]> {
    this.logger.log('Service Call: Get Transactions');
    return this.http.get<TransactionModel[]>(
      this.path,
      {
        params: { OrgId: orgId },
        headers: { 'x-api-version': '1.1' }
      },
    ).pipe(
      tap(() => this.logger.log('Service Call Complete: Get Transactions')),
      map((transactions: TransactionModel[]) => {
      const sortedTransactions = sortArrayByDate<TransactionModel>(transactions, 'date').reverse();
      return sortedTransactions.map((transaction: TransactionModel) => ({
        ...transaction,
        lines: transaction.lines.map((line: TransactionLineModel) => ({
          ...line,
          date: transaction.date
        }))
      }));
    }));
  }

  addTransaction(transaction: AddTransactionDto | ManualLedgersDto | AddTrxExpenseDto, orgId): Observable<TransactionModel> {
    this.logger.log('Service Call: Add Transaction');
    return this.http.post<TransactionModel>(
      this.path,
      transaction,
      { params: { OrgId: orgId } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Add Transaction')));
  }

  editTransaction(transaction: EditTransactionDto | EditTrxExpenseDto, orgId): Observable<TransactionModel> {
    this.logger.log('Service Call: Edit Transaction');
    return this.http.put<TransactionModel>(
      this.path,
      transaction,
      { params: { OrgId: orgId }}
    ).pipe(tap(() => this.logger.log('Service Call Complete: Edit Transaction')));
  }

  getTransactionLedgerItems(transactionId: string, orgId: string): Observable<LedgerItemModel[]> {
    this.logger.log('Service Call: Get Transaction Ledger Items');
    return this.http.get<LedgerItemModel[]>(
      this.path + `/${transactionId}` + '/Ledger',
      { params: { OrgId: orgId } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Transaction Ledger Items')));
  }

  editTransactionLedgerEntries(transaction: EditTransactionDto, orgId): Observable<TransactionModel> {
    this.logger.log('Service Call: Edit Transaction Ledger');
    return this.http.put<TransactionModel>(
      this.path + '/Ledger',
      transaction,
      { params: { OrgId: orgId }}
    ).pipe(tap(() => this.logger.log('Service Call Complete: Edit Transaction Ledger')));
  }

  deleteTransaction(id: string, orgId): Observable<boolean> {
    this.logger.log('Service Call: Delete Transaction');
    return this.http.delete<boolean>(
      this.path + `/${id}`,
      { params: { OrgId: orgId }}
    ).pipe(tap(() => this.logger.log('Service Call Complete: Delete Transaction')));
  }

  exportTransactions(orgId: string): Observable<string> {
    this.logger.log('Service Call: Export Transactions');
    return this.http.get(
      this.pathExportTransaction,
      {
        params: { OrgId: orgId },
        responseType: 'text'
      }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Export Transactions')));
  }

  importTransactions(file: FormData, orgId: string): Observable<any> {
    this.logger.log('Service Call: Import Transactions');
    return this.http.post(
      this.pathImportTransaction,
      file,
      {
        params: { OrgId: orgId },
      }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Import Transactions')));
  }

}
