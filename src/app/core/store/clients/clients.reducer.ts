import { Action, createReducer, on } from '@ngrx/store';

import * as clientsActions from './/clients.actions';
import { TransactionModel } from '../../interfaces/transaction.interface';
import { JobModel } from '../../interfaces/job.interface';
import { ClientModel } from '../../interfaces/clients.interface';

export interface IClientsState {
  client: ClientModel;
  clients: ClientModel[];
  clientJobs: JobModel[];
  clientInvoices: TransactionModel[];
  dataIsLoading: boolean;
  modalDataIsLoading: boolean;
  loadAfterAction: boolean;
  spinner: boolean;
  secondarySpinner: boolean;
}

export const initialState: IClientsState = {
  client: null,
  clients: null,
  clientJobs: null,
  clientInvoices: null,
  dataIsLoading: false,
  modalDataIsLoading: false,
  loadAfterAction: false,
  spinner: false,
  secondarySpinner: false
};

export function clientsReducer(state: IClientsState | undefined, action: Action): IClientsState {
  return reducer(state, action);
}

const reducer = createReducer<IClientsState>(
  initialState,

  /** Clients */
  on(clientsActions.clients, state => ({
    ...state,
    dataIsLoading: true
  })),

  on(clientsActions.clientsSuccess, (state, { clients }) => ({
    ...state,
    clients,
    loadAfterAction: true,
    dataIsLoading: false
  })),

  on(clientsActions.clientsFailure, state => ({
    ...state,
    dataIsLoading: false
  })),

  /** Client By Id */
  on(clientsActions.clientByIdSuccess, (state, { client }) => ({
    ...state,
    client
  })),

  /** Add Client */
  on(clientsActions.addClient, state => ({
    ...state,
    client: null,
    loadAfterAction: false,
    spinner: true
  })),

  on(clientsActions.addClientSuccess, (state, { client }) => ({
    ...state,
    client,
    spinner: false
  })),

  on(clientsActions.addClientFailure, state => ({
    ...state,
    spinner: false
  })),

  /** Edit Client */
  on(clientsActions.editClient, state => ({
    ...state,
    loadAfterAction: false,
    spinner: true
  })),

  on(clientsActions.editClientSuccess, (state, { client }) => ({
    ...state,
    client,
    spinner: false
  })),

  on(clientsActions.editClientFailure, state => ({
    ...state,
    spinner: false
  })),

  /** Delete Client */
  on(clientsActions.deleteClient, state => ({
    ...state,
    loadAfterAction: false,
    secondarySpinner: true
  })),

  on(clientsActions.deleteClientSuccess, state => ({
    ...state,
    secondarySpinner: false
  })),

  on(clientsActions.deleteClientFailure, state => ({
    ...state,
    secondarySpinner: false
  })),

  /** Get Client Jobs */
  on(clientsActions.clientJobs, state => ({
    ...state,
    modalDataIsLoading: true,
    })
  ),

  on(clientsActions.clientJobsSuccess, (state, { clientJobs } ) => ({
    ...state,
    clientJobs,
    modalDataIsLoading: false
    })
  ),

  on(clientsActions.clientJobsFailure, (state) => ({
    ...state,
    modalDataIsLoading: false
    })
  ),

  /** Get Client Invoices */
  on(clientsActions.clientInvoices, (state) => ({
    ...state,
    modalDataIsLoading: true,
    })
  ),

  on(clientsActions.clientInvoicesSuccess, (state, { clientInvoices }) => ({
    ...state,
    clientInvoices,
    modalDataIsLoading: false,
    })
  ),

  on(clientsActions.clientInvoicesFailure, (state) => ({
    ...state,
    modalDataIsLoading: false,
    })
  ),

);
