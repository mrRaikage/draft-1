import { createAction, props } from '@ngrx/store';
import { LedgerDataModel, LedgerParamsModel } from '../../../interfaces/ledger.interface';

export const filterLedgersData = createAction('[Ledgers] Filtered Ledgers Data', props<{ params?: LedgerParamsModel, url?: string }>());
export const filterLedgersDataSuccess = createAction(
  '[Ledgers] Filtered Ledgers Data Success',
  props<{ ledgersData: LedgerDataModel }>()
);
export const filterLedgersDataFailure = createAction('[Ledgers] Filtered Ledgers Data Failure');
export const clearLedgersData = createAction('[Ledgers] Clear Ledgers Data');
