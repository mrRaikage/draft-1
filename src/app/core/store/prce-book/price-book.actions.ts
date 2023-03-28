import { createAction, props } from '@ngrx/store';

import { AddPriceBookDto, PriceBookItemModel } from '../../interfaces/price-book.interface';

/** Get Organization PriceBook */
export const orgPriceBook = createAction('[PriceBook] Organization PriceBook');
export const orgPriceBookSuccess = createAction('[PriceBook] Organization PriceBook Success', props<{ priceBook: PriceBookItemModel[] }>());
export const orgPriceBookFailure = createAction('[PriceBook] Organization PriceBook Failure');

/** Add Organization PriceBook */
export const addOrgPriceBook = createAction('[PriceBook] Add Organization PriceBook', props<{ data: AddPriceBookDto }>());
export const addOrgPriceBookSuccess = createAction('[PriceBook] Add Organization PriceBook Success', props<{ quickAddPriceBook: PriceBookItemModel }>());
export const addOrgPriceBookFailure = createAction('[PriceBook] Add Organization PriceBook Failure');

/** Edit Organization PriceBook */
export const editOrgPriceBook = createAction('[PriceBook] Edit Organization PriceBook', props<{ data: PriceBookItemModel[] }>());
export const editOrgPriceBookSuccess = createAction('[PriceBook] Edit Organization PriceBook Success');
export const editOrgPriceBookFailure = createAction('[PriceBook] Edit Organization PriceBook Failure');

/** Get Client PriceBook */
export const clientPriceBook = createAction('[PriceBook] Client PriceBook', props<{ clientId: string }>());
export const clientPriceBookSuccess = createAction('[PriceBook] Client PriceBook Success', props<{ priceBook: PriceBookItemModel[] }>());
export const clientPriceBookFailure = createAction('[PriceBook] Client PriceBook Failure');

/** Add Client PriceBook */
export const addClientPriceBook = createAction('[PriceBook] Add Client PriceBook', props<{ clientId: string, data: AddPriceBookDto }>());
export const addClientPriceBookSuccess = createAction('[PriceBook] Add Client PriceBook Success', props<{ clientId: string, quickAddPriceBook: PriceBookItemModel }>());
export const addClientPriceBookFailure = createAction('[PriceBook] Add Client PriceBook Failure');

/** Edit Client PriceBook */
export const editClientPriceBook = createAction('[PriceBook] Edit Client PriceBook', props<{ clientId: string, data: PriceBookItemModel[] }>());
export const editClientPriceBookSuccess = createAction('[PriceBook] Edit Client PriceBook Success', props<{ clientId: string }>());
export const editClientPriceBookFailure = createAction('[PriceBook] Edit Client PriceBook Failure');
