import { createAction, props } from '@ngrx/store';

import {
  AddTransactionDto,
  AddTrxExpenseDto,
  EditTransactionDto,
  EditTrxExpenseDto,
  LedgerItemModel,
  ManualLedgersDto,
  TransactionModel
} from '../../interfaces/transaction.interface';

/** Get Transactions */
export const transactionsData = createAction('[Transactions] Transactions Data');
export const transactionsDataSuccess = createAction('[Transactions] Transactions Data Success', props<{ data: TransactionModel[] }>());
export const transactionsDataFailure = createAction('[Transactions] Transactions Data Failure');

/** CRUD Transaction */
export const addTransaction = createAction(
  '[Transactions] Add Transaction',
  props<{ transaction: AddTransactionDto | ManualLedgersDto | AddTrxExpenseDto, hasAssetAccount?: boolean }>()
);
export const addTransactionSuccess = createAction(
  '[Transactions] Add Transaction Success',
  props<{ transaction: TransactionModel, hasAssetAccount?: boolean }>()
);
export const addTransactionFailure = createAction('[Transactions] Add Transaction Failure');

export const editTransaction = createAction(
  '[Transactions] Edit Transaction',
  props<{ data: EditTransactionDto | EditTrxExpenseDto, hasAssetAccount?: boolean }>()
);
export const editTransactionLedgerEntries = createAction('[Transactions] Edit Transaction Ledger Entries', props<{
  data: EditTransactionDto
}>());
export const editTransactionSuccess = createAction(
  '[Transactions] Edit Transaction Success',
  props<{ transaction: TransactionModel, hasAssetAccount?: boolean }>()
);
export const editTransactionFailure = createAction('[Transactions] Edit Transaction Failure');

export const deleteTransaction = createAction('[Transactions] Delete Transaction', props<{ id: string }>());
export const deleteTransactionSuccess = createAction('[Transactions] Delete Transaction Success');
export const deleteTransactionFailure = createAction('[Transactions] Delete Transaction Failure');

/** Export Transactions */
export const exportTransactions = createAction('[Transactions] Export Transactions');
export const exportTransactionsSuccess = createAction('[Transactions] Export Transactions Success', props<{ csvText: string }>());
export const exportTransactionsFailure = createAction('[Transactions] Export Transactions Failure');

/** Get Cash Transaction Ledger Items */
export const transactionLedgerItems = createAction('[Transactions] Transaction Ledger Items', props<{ transactionId: string }>());
export const transactionLedgerItemsSuccess = createAction(
  '[Transactions] Transaction Ledger Items Success',
  props<{ data: LedgerItemModel[] }>()
);
export const transactionLedgerItemsFailure = createAction('[Transactions] Transaction Ledger Items Failure');

/** Import Transactions */
export const importTransactions = createAction('[Transactions] Import Transactions Items', props<{ file: FormData }>());
export const importTransactionsSuccess = createAction('[Transactions] Import Transactions Items Success');
export const importTransactionsFailure = createAction('[Transactions] Import Transactions Items Failure');

/** Clean Transaction State */
export const cleanState = createAction('[Transactions] Clean State');

/** Set Is Data Loaded */
export const setTransactionsDataIsLoaded = createAction('[Transactions] Set Is Transaction Data Loaded', props<{ isLoaded: boolean }>());
