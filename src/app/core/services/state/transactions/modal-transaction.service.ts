import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { emptyTransaction } from '../../../constants/transaction.constants';
import { ManualLedgersModel, TransactionModel } from '../../../interfaces/transaction.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalTransactionService {

  private currentTransactionSubject: BehaviorSubject<TransactionModel> = new BehaviorSubject<TransactionModel>(emptyTransaction);
  private currentManualLedgerSubject: BehaviorSubject<ManualLedgersModel | TransactionModel> = new BehaviorSubject<TransactionModel>(null);

  public currentTransaction$: Observable<TransactionModel> = this.currentTransactionSubject.asObservable();
  public currentManualLedger$: Observable<ManualLedgersModel | TransactionModel> = this.currentManualLedgerSubject.asObservable();

  constructor() { }

  setCurrentTransaction(transaction: TransactionModel): void {
    this.currentTransactionSubject.next(transaction);
  }

  getCurrentTransaction(): TransactionModel {
    return this.currentTransactionSubject.value;
  }

  setCurrentManualLedger(manualLedgersModel: ManualLedgersModel | TransactionModel): void {
    this.currentManualLedgerSubject.next(manualLedgersModel);
  }

  getCurrentTransactionLedger(): ManualLedgersModel | TransactionModel {
    return this.currentManualLedgerSubject.value;
  }

}
