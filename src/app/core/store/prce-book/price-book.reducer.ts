import { Action, createReducer, on } from '@ngrx/store';

import { PriceBookItemModel } from '../../interfaces/price-book.interface';
import * as priceBookActions from './/price-book.actions';

export interface IPriceBookState {
  clientPriceBook: PriceBookItemModel[];
  orgPriceBook: PriceBookItemModel[];
  loadAfterAction: boolean;
  dataIsLoading: boolean;
  spinner: boolean;
  quickAddPriceBook: PriceBookItemModel;
}

export const initialState: IPriceBookState = {
  clientPriceBook: null,
  orgPriceBook: null,
  loadAfterAction: false,
  dataIsLoading: false,
  spinner: false,
  quickAddPriceBook: null
};

export function priceBookReducer(state: IPriceBookState | undefined, action: Action): IPriceBookState {
  return reducer(state, action);
}

const reducer = createReducer<IPriceBookState>(
  initialState,

  /** Client Price Book */
  on(priceBookActions.clientPriceBook, state => ({
    ...state,
    dataIsLoading: true
  })),

  on(priceBookActions.clientPriceBookSuccess, (state, {priceBook}) => ({
    ...state,
    clientPriceBook: priceBook,
    loadAfterAction: true,
    dataIsLoading: false
  })),

  on(priceBookActions.clientPriceBookFailure, state => ({
    ...state,
    dataIsLoading: false
  })),

  /** Add Client Price Book */
  on(priceBookActions.addClientPriceBook, state => ({
    ...state,
    loadAfterAction: false,
    spinner: true,
    quickAddPriceBook: null
  })),

  on(priceBookActions.addClientPriceBookSuccess, (state, { quickAddPriceBook }) => ({
    ...state,
    spinner: false,
    quickAddPriceBook
  })),

  on(priceBookActions.addClientPriceBookFailure, state => ({
    ...state,
    loadAfterAction: false,
    spinner: false
  })),

  /** Edit Client Price Book */
  on(priceBookActions.editClientPriceBook, state => ({
    ...state,
    spinner: true
  })),

  on(priceBookActions.editClientPriceBookSuccess, state => ({
    ...state,
    spinner: false
  })),

  on(priceBookActions.editClientPriceBookFailure, state => ({
    ...state,
    loadAfterAction: false,
    spinner: false
  })),

  /** Organization Price Book */
  on(priceBookActions.orgPriceBook, state => ({
    ...state,
    dataIsLoading: true
  })),

  on(priceBookActions.orgPriceBookSuccess, (state, {priceBook}) => ({
    ...state,
    orgPriceBook: priceBook,
    loadAfterAction: true,
    dataIsLoading: false
  })),

  on(priceBookActions.orgPriceBookFailure, state => ({
    ...state,
    dataIsLoading: false
  })),

  /** Add Org Price Book */
  on(priceBookActions.addOrgPriceBook, state => ({
    ...state,
    loadAfterAction: false,
    spinner: true,
    quickAddPriceBook: null
  })),

  on(priceBookActions.addOrgPriceBookSuccess, (state, { quickAddPriceBook }) => ({
    ...state,
    spinner: false,
    quickAddPriceBook
  })),

  on(priceBookActions.addOrgPriceBookFailure, state => ({
    ...state,
    loadAfterAction: false,
    spinner: false
  })),

  /** Edit Organization Price Book */
  on(priceBookActions.editOrgPriceBook, state => ({
    ...state,
    loadAfterAction: false,
    spinner: true
  })),

  on(priceBookActions.editOrgPriceBookSuccess, state => ({
    ...state,
    spinner: false
  })),

  on(priceBookActions.editOrgPriceBookFailure, state => ({
    ...state,
    loadAfterAction: false,
    spinner: false
  }))
);
