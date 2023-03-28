import { createAction, props } from '@ngrx/store';
import { InvoiceModel } from '../../interfaces/invoice.interface';

import { TransactionModel } from '../../interfaces/transaction.interface';
import { JobModel } from '../../interfaces/job.interface';
import { AddClientDto, ClientModel } from '../../interfaces/clients.interface';

/** Clients */
export const clients = createAction('[Clients] Clients');
export const clientsSuccess = createAction('[Clients] Clients Success', props<{ clients: ClientModel[]}>());
export const clientsFailure = createAction('[Clients] Clients Failure');

/** Get Client By Id */
export const clientById = createAction('[Clients] Client By Id', props<{ clientId: string }>());
export const clientByIdSuccess = createAction('[Clients] Client By Id Success', props<{ client: ClientModel }>());
export const clientByIdFailure = createAction('[Clients] Client By Id Failure');

/** Add New Client */
export const addClient = createAction('[Clients] Add Client', props<{ addClient: AddClientDto }>());
export const addClientSuccess = createAction('[Clients] Add Client Success', props<{ client: ClientModel }>());
export const addClientFailure = createAction('[Clients] Add Client Failure');

/** Edit Client */
export const editClient = createAction('[Clients] Edit Client', props<{ editClient: ClientModel }>());
export const editClientSuccess = createAction('[Clients] Edit Client Success', props<{ client: ClientModel }>());
export const editClientFailure = createAction('[Clients] Edit Client Failure');

/** Delete Client */
export const deleteClient = createAction('[Clients] Delete Client', props<{ clientId: string }>());
export const deleteClientSuccess = createAction('[Clients] Delete Client Success');
export const deleteClientFailure = createAction('[Clients] Delete Client Failure');

/** Client Jobs */
export const clientJobs = createAction('[Clients] Client Jobs', props<{ clientId: string}>());
export const clientJobsSuccess = createAction('[Clients] Client Jobs Success', props<{ clientJobs: JobModel[] }>());
export const clientJobsFailure = createAction('[Clients] Client Jobs Failure');

/** Client Invoices */
export const clientInvoices = createAction('[Clients] Client Invoices', props<{ clientId: string}>());
export const clientInvoicesSuccess = createAction('[Clients] Client Invoices Success', props<{ clientInvoices: TransactionModel[] }>());
export const clientInvoicesFailure = createAction('[Clients] Client Invoices Failure');
