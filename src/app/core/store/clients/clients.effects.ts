import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as clientsActions from './/clients.actions';
import { ClientApiService } from '../../services/api/client-api.service';
import { TransactionModel } from '../../interfaces/transaction.interface';
import { JobModel } from '../../interfaces/job.interface';
import { ClientModel } from '../../interfaces/clients.interface';
import { ErrorMessageService } from '../../services/api/error-message.service';

@Injectable()
export class ClientsEffects {

  constructor(
    private actions$: Actions,
    private clientApiService: ClientApiService,
    private toastr: ToastrService,
    private errorMessageService: ErrorMessageService
  ) {
  }

  /** Clients */
  clients$ = createEffect(() => this.actions$.pipe(
    ofType(clientsActions.clients),
    switchMap(() => this.clientApiService.getClients().pipe(
      map((clients: ClientModel[]) => clientsActions.clientsSuccess({ clients })),
      catchError(() => of(clientsActions.clientsFailure()))
    ))
  ));

  /** Client By Id */
  clientById$ = createEffect(() => this.actions$.pipe(
    ofType(clientsActions.clientById),
    switchMap(({ clientId }) => this.clientApiService.getClientById(clientId).pipe(
      map((client: ClientModel) => clientsActions.clientByIdSuccess({ client })),
      catchError(() => of(clientsActions.clientByIdFailure()))
    ))
  ));

  /** Add Client */
  addClient$ = createEffect(() => this.actions$.pipe(
    ofType(clientsActions.addClient),
    switchMap(({ addClient }) => this.clientApiService.addClient(addClient).pipe(
      map((client: ClientModel) => {
        this.toastr.success('Client Has Been Added');
        return clientsActions.addClientSuccess({ client });
      }),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Client Not Added`);
        return of(clientsActions.addClientFailure());
      })
    ))
  ));

  addClientSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(clientsActions.addClientSuccess),
    map(() => clientsActions.clients())
  ));

  /** Edit Client */
  editClient$ = createEffect(() => this.actions$.pipe(
    ofType(clientsActions.editClient),
    switchMap(({ editClient }) => this.clientApiService.editClient(editClient).pipe(
      map((client: ClientModel) => {
        this.toastr.success('Client Has Been Updated');
        return clientsActions.editClientSuccess({ client });
      }),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || 'Oops! Client Not Updated');
        return of(clientsActions.editClientFailure());
      })
    ))
  ));

  editClientSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(clientsActions.editClientSuccess),
    map(() => clientsActions.clients())
  ));

  /** Delete Client */
  deleteClient$ = createEffect(() => this.actions$.pipe(
    ofType(clientsActions.deleteClient),
    switchMap(({ clientId }) => this.clientApiService.deleteClient(clientId).pipe(
      map(() => {
        this.toastr.success('Client Deleted');
        return clientsActions.deleteClientSuccess();
      }),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || 'Oops! Client Not Deleted');
        return of(clientsActions.deleteClientFailure());
      })
    ))
  ));

  deleteClientSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(clientsActions.deleteClientSuccess),
    map(() => clientsActions.clients())
  ));

  /** Client Jobs */
  clientJobs$ = createEffect( () => this.actions$.pipe(
    ofType(clientsActions.clientJobs),
    switchMap(({ clientId }) => this.clientApiService.getClientJobs(clientId).pipe(
      map( (clientJobs: JobModel[]) => clientsActions.clientJobsSuccess( { clientJobs })),
      catchError( () => of(clientsActions.clientJobsFailure()))
    ))
  ));

  /** Client Invoices */
  clientInvoices$ = createEffect( () => this.actions$.pipe(
    ofType(clientsActions.clientInvoices),
    switchMap(({ clientId }) => this.clientApiService.getClientInvoices(clientId).pipe(
      map( (clientInvoices: TransactionModel[]) => clientsActions.clientInvoicesSuccess( { clientInvoices })),
      catchError( () => of(clientsActions.clientInvoicesFailure()))
    ))
  ));
}
