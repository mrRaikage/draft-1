import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

import { InvoiceModel } from '../../interfaces/invoice.interface';
import * as jobsActions from './job.actions';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { JobApiService } from '../../services/api/job-api.service';
import { ChargeModel, JobModel } from '../../interfaces/job.interface';
import { ErrorMessageService } from '../../services/api/error-message.service';

@Injectable()
export class JobEffects {

  constructor(
    private actions$: Actions,
    private lSService: LocalStorageService,
    private jobApiService: JobApiService,
    private toastr: ToastrService,
    private errorMessageService: ErrorMessageService
  ) {
  }

  /** Get Jobs */
  getJobsData$ = createEffect(() => this.actions$.pipe(
    ofType(jobsActions.jobsData),
    switchMap(() => this.jobApiService.getJobs(this.lSService.getCurrentOrg().id).pipe(
      map((data: JobModel[]) => jobsActions.jobsDataSuccess({ data })),
      catchError(() => of(jobsActions.jobsDataFailure()))
    ))
  ));

  /** Add Job */
  addJob$ = createEffect(() => this.actions$.pipe(
    ofType(jobsActions.addJob),
    switchMap(({ data }) => this.jobApiService.addJob(data).pipe(
      map((addJobResponse: JobModel) => {
        this.toastr.success('Job Added!');
        return jobsActions.addJobSuccess({ data: addJobResponse });
      }),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Job Not Added`);
        return of(jobsActions.addJobFailure());
      })
    ))
  ));

  addJobSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(jobsActions.addJobSuccess),
    map(() => jobsActions.jobsData())
  ));

  /** Edit Job */
  editJob$ = createEffect(() => this.actions$.pipe(
    ofType(jobsActions.editJob),
    switchMap(({ data }) => this.jobApiService.editJob(data).pipe(
      map((jobModel: JobModel) => {
        this.toastr.success('Job Updated!');
        return jobsActions.editJobSuccess({ data: jobModel });
      }),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Job Not Updated`);
        return of(jobsActions.editChargesDataFailure());
      })
    ))
  ));

  editJobSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(jobsActions.editJobSuccess),
    map(() => jobsActions.jobsData())
  ));

  /** Delete Job */
  deleteJob$ = createEffect(() => this.actions$.pipe(
    ofType(jobsActions.deleteJob),
    switchMap(({ jobId }) => this.jobApiService.deleteJob(jobId).pipe(
      map(() => {
        this.toastr.success('Job Deleted!');
        return jobsActions.deleteJobSuccess();
      }),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Job Not Deleted`);
        return of(jobsActions.deleteJobFailure());
      })
    ))
  ));

  deleteJobSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(jobsActions.deleteJobSuccess),
    map(() => jobsActions.jobsData())
  ));

  /** Get Charges */
  getChargesData$ = createEffect(() => this.actions$.pipe(
    ofType(jobsActions.chargesData),
    switchMap(({ jobId }) => this.jobApiService.getCharges(this.lSService.getCurrentOrg().id, jobId).pipe(
      map((data: ChargeModel[]) => jobsActions.chargesDataSuccess({ data })),
      catchError(() => of(jobsActions.chargesDataFailure()))
    ))
  ));

  /** Edit Charges */
  editChargesData$ = createEffect(() => this.actions$.pipe(
    ofType(jobsActions.editChargesData),
    switchMap(({ jobId, editedCharges }) => this.jobApiService.putCharges(jobId, editedCharges).pipe(
      map((data: ChargeModel[]) => {
        this.toastr.success('Charges Saved!');
        return jobsActions.editChargesDataSuccess({ data });
      }),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Charges Not Saved`);
        return of(jobsActions.editChargesDataFailure());
      })
    ))
  ));

  /** Get Job Invoices */
  getJobInvoicesData$ = createEffect(() => this.actions$.pipe(
    ofType(jobsActions.jobInvoicesData),
    switchMap(({ jobId }) => this.jobApiService.getJobInvoices(this.lSService.getCurrentOrg().id, jobId).pipe(
      map((data: InvoiceModel[]) => jobsActions.jobInvoicesDataSuccess({ data })),
      catchError(() => of(jobsActions.jobInvoicesDataFailure()))
    ))
  ));

  /** Create Job Invoice */
  createJobInvoice = createEffect(() => this.actions$.pipe(
    ofType(jobsActions.createJobInvoice),
    switchMap(({ jobId, chargesIds, groupBy }) => this.jobApiService.createJobInvoice(jobId, chargesIds, groupBy).pipe(
      map((transaction: InvoiceModel) => {
        return jobsActions.createJobInvoiceSuccess({ transaction });
      }),
      catchError(() => {
        return of(jobsActions.createJobInvoiceFailure());
      })
    ))
  ));
}
