import { createAction, props } from '@ngrx/store';
import { InvoiceModel } from '../../interfaces/invoice.interface';

import { AddJobDto, ChargeModel, EditChargeDto, JobModel } from '../../interfaces/job.interface';
import { TransactionModel } from '../../interfaces/transaction.interface';

/** Get Job */
export const jobsData = createAction('[Jobs] Jobs Data');
export const jobsDataSuccess = createAction('[Jobs] Jobs Data Success', props<{ data: JobModel[] }>());
export const jobsDataFailure = createAction('[Jobs] Jobs Data Failure');

/** Add Job */
export const addJob = createAction('[Jobs] Add Job', props<{ data: AddJobDto }>());
export const addJobSuccess = createAction('[Jobs] Add Job Success', props<{ data: JobModel }>());
export const addJobFailure = createAction('[Jobs] Add Job Failure');

/** Edit Job */
export const editJob = createAction('[Jobs] Edit Job', props<{ data: JobModel }>());
export const editJobSuccess = createAction('[Jobs] Edit Job Success', props<{ data: JobModel }>());
export const editJobFailure = createAction('[Jobs] Edit Job Failure');

/** Delete Job */
export const deleteJob = createAction('[Jobs] Delete Job', props<{ jobId: string }>());
export const deleteJobSuccess = createAction('[Jobs] Delete Job Success');
export const deleteJobFailure = createAction('[Jobs] Delete Job Failure');

/** Get Charge */
export const chargesData = createAction('[Jobs] Charges Data', props<{ jobId: string }>());
export const chargesDataSuccess = createAction('[Jobs] Charges Data Success', props<{ data: ChargeModel[] }>());
export const chargesDataFailure = createAction('[Jobs] Charges Data Failure');

/** Edit Charge */
export const editChargesData = createAction('[Jobs] Edit Charges Data', props<{
  jobId: string,
  editedCharges: EditChargeDto[]
}>());
export const editChargesDataSuccess = createAction('[Jobs] Edit Charges Data Success', props<{ data: ChargeModel[] }>());
export const editChargesDataFailure = createAction('[Jobs] Edit Charges Data Failure');

/** Get Job Invoices */
export const jobInvoicesData = createAction('[Jobs] Invoices Data', props<{ jobId: string }>());
export const jobInvoicesDataSuccess = createAction('[Jobs] Invoices Data Success', props<{ data: InvoiceModel[] }>());
export const jobInvoicesDataFailure = createAction('[Jobs] Invoices Data Failure');

/** Create Job Invoice */
export const createJobInvoice = createAction('[Jobs] Create Job Invoice', props<{
  jobId: string,
  chargesIds: string[],
  groupBy: string
}>());
export const createJobInvoiceSuccess = createAction('[Jobs] Create Job Invoice Success', props<{ transaction: InvoiceModel }>());
export const createJobInvoiceFailure = createAction('[Jobs] Create Job Invoice Failure');
