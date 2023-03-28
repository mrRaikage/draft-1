import { Action, createReducer, on } from '@ngrx/store';

import * as transactionsActions from './transactions.actions';
import { LedgerItemModel, TransactionModel } from '../../interfaces/transaction.interface';

export interface ITransactionsState {
  list: TransactionModel[];
  transactionsDataLoaded: boolean;
  transactionsDataLoadedAfterAction: boolean;
  spinnerStarted: boolean;
  deleteSpinnerStarted: boolean;
  csvSpinnerStarted: boolean;
  csvText: string;
  currentTransaction: TransactionModel;
  transactionLedgerItemsList: LedgerItemModel[];
  ledgerItemsLoading: boolean;
  importTransactionsSpinner: boolean;
}

export const initialState: ITransactionsState = {
  list: null,
  transactionsDataLoaded: false,
  transactionsDataLoadedAfterAction: false,
  spinnerStarted: false,
  deleteSpinnerStarted: false,
  csvSpinnerStarted: false,
  csvText: null,
  currentTransaction: null,
  transactionLedgerItemsList: null,
  ledgerItemsLoading: false,
  importTransactionsSpinner: false
};

export function transactionsReducer(state: ITransactionsState | undefined, action: Action): ITransactionsState {
  return reducer(state, action);
}

const reducer = createReducer<ITransactionsState>(
  initialState,

  /** Get Transactions */
  on(transactionsActions.transactionsData, state => ({
      ...state,
      transactionsDataLoaded: false
    })
  ),

  on(transactionsActions.transactionsDataSuccess, (state, { data }) => ({
      ...state,
    list: data,
    transactionsDataLoaded: true,
    transactionsDataLoadedAfterAction: true,
    spinnerStarted: false
    })
  ),

  /** Add Transaction */
  on(transactionsActions.addTransaction, state => ({
    ...state,
    currentTransaction: null,
    transactionsDataLoadedAfterAction: false,
    spinnerStarted: true,
  })),

  on(transactionsActions.addTransactionSuccess, (state, { transaction }) => ({
    ...state,
    currentTransaction: transaction
  })),

  on(transactionsActions.addTransactionFailure, state => ({
    ...state,
    spinnerStarted: false,
  })),

  /** Edit Transaction */
  on(transactionsActions.editTransaction, state => ({
    ...state,
    transactionsDataLoadedAfterAction: false,
    spinnerStarted: true,
  })),

  on(transactionsActions.editTransactionLedgerEntries, state => ({
    ...state,
    transactionsDataLoadedAfterAction: false,
    spinnerStarted: true,
  })),

  on(transactionsActions.editTransactionSuccess, (state, { transaction }) => ({
    ...state,
    currentTransaction: transaction
  })),

  on(transactionsActions.editTransactionFailure, state => ({
    ...state,
    spinnerStarted: false,
  })),

  /** Delete Transaction */
  on(transactionsActions.deleteTransaction, state => ({
    ...state,
    transactionsDataLoadedAfterAction: false,
    deleteSpinnerStarted: true,
  })),

  on(transactionsActions.deleteTransactionSuccess, state => ({
    ...state,
    deleteSpinnerStarted: false,
  })),

  on(transactionsActions.deleteTransactionFailure, state => ({
    ...state,
    deleteSpinnerStarted: false
  })),

  /** Set Transaction Data is Loaded */
  on(transactionsActions.setTransactionsDataIsLoaded, (state, { isLoaded }) => ({
    ...state,
    transactionsDataLoaded: isLoaded
  })),

  /** Export Transactions */
  on(transactionsActions.exportTransactions, state => ({
    ...state,
    csvSpinnerStarted: true
  })),

  on(transactionsActions.exportTransactionsSuccess, (state, { csvText }) => ({
    ...state,
    csvText,
    csvSpinnerStarted: false
  })),

  on(transactionsActions.exportTransactionsFailure, state => ({
    ...state,
    csvSpinnerStarted: false
  })),

  /** Transaction Ledger Items */
  on(transactionsActions.transactionLedgerItems, state => ({
    ...state,
    ledgerItemsLoading: true
  })),

  on(transactionsActions.transactionLedgerItemsSuccess, (state, { data }) => ({
    ...state,
    transactionLedgerItemsList: data,
    ledgerItemsLoading: false
  })),

  on(transactionsActions.transactionLedgerItemsFailure, state => ({
    ...state,
    spinnerStarted: false,
    ledgerItemsLoading: false
  })),

  /** Import Transactions */
  on(transactionsActions.importTransactions, state => ({
    ...state,
    importTransactionsSpinner: true
  })),

  on(transactionsActions.importTransactionsSuccess, state => ({
    ...state,
    importTransactionsSpinner: false
  })),

  on(transactionsActions.importTransactionsFailure, state => ({
    ...state,
    importTransactionsSpinner: false
  })),

  /** Clean State */
  on(transactionsActions.cleanState, state => initialState),

);
