import { Action, createReducer, on } from '@ngrx/store';
import { InvoiceModel } from '../../interfaces/invoice.interface';

import * as jobsActions from './job.actions';
import { ChargeModel, JobModel } from '../../interfaces/job.interface';
import { TransactionModel } from '../../interfaces/transaction.interface';

export interface IJobsState {
  list: JobModel[];
  currentJob: JobModel;
  isDataLoadedAfterAction: boolean;
  spinner: boolean;
  deleteSpinner: boolean;
  isJobsLoaded: boolean;
  modalDataIsLoading: boolean;
  listOfCharges: ChargeModel[];
  currentCharge: ChargeModel;
  isChargesLoading: boolean;
  jobInvoice: InvoiceModel;
  jobInvoicesList: InvoiceModel[];
}

export const initialState: IJobsState = {
  list: null,
  currentJob: null,
  isDataLoadedAfterAction: false,
  spinner: false,
  deleteSpinner: false,
  isJobsLoaded: false,
  modalDataIsLoading: false,
  listOfCharges: null,
  currentCharge: null,
  isChargesLoading: false,
  jobInvoice: null,
  jobInvoicesList: null,
};

export function jobReducer(state: IJobsState | undefined, action: Action): IJobsState {
  return reducer(state, action);
}

const reducer = createReducer<IJobsState>(
  initialState,

  /** Get job */
  on(jobsActions.jobsData, state => ({
    ...state,
    isJobsLoaded: false,
  })),

  on(jobsActions.jobsDataSuccess, (state, { data}) => ({
    ...state,
    list: data,
    isJobsLoaded: true,
    isDataLoadedAfterAction: true,
  })),

  /** Add job */
  on(jobsActions.addJob, state => ({
    ...state,
    currentJob: null,
    isDataLoadedAfterAction: false,
    spinner: true,
  })),

  on(jobsActions.addJobSuccess, (state, { data }) => ({
    ...state,
    currentJob: data,
    spinner: false,
  })),

  on(jobsActions.addJobFailure, state => ({
    ...state,
    isDataLoadedAfterAction: false,
    spinner: false,
  })),

  /** Edit job */
  on(jobsActions.editJob, state => ({
    ...state,
    currentJob: null,
    isDataLoadedAfterAction: false,
    spinner: true,
  })),

  on(jobsActions.editJobSuccess, (state, { data }) => ({
    ...state,
    currentJob: data,
    spinner: false,
  })),

  on(jobsActions.editJobFailure, state => ({
    ...state,
    isDataLoadedAfterAction: false,
    spinner: false,
  })),

  /** Delete job */
  on(jobsActions.deleteJob, state => ({
    ...state,
    isDataLoadedAfterAction: false,
    deleteSpinner: true,
  })),

  on(jobsActions.deleteJobSuccess, state => ({
    ...state,
    deleteSpinner: false,
  })),

  on(jobsActions.deleteJobFailure, state => ({
    ...state,
    isDataLoadedAfterAction: false,
    deleteSpinner: false,
  })),

  /** Get Charge */
  on(jobsActions.chargesData, (state) => ({
    ...state,
    isChargesLoading: true
  })),

  on(jobsActions.chargesDataSuccess, (state, { data}) => ({
    ...state,
    listOfCharges: data,
    isChargesLoading: false
  })),

  on(jobsActions.chargesDataFailure, state => ({
    ...state,
    isChargesLoading: false
  })),

  /** Edit Charges */
  on(jobsActions.editChargesData, (state) => ({
    ...state,
    spinner: true,
    isDataLoadedAfterAction: false
  })),

  on(jobsActions.editChargesDataSuccess, (state, { data }) => ({
    ...state,
    listOfCharges: data,
    isDataLoadedAfterAction: true,
    spinner: false
  })),

  on(jobsActions.editChargesDataFailure, (state) => ({
    ...state,
    spinner: false,
  })),

  /** Get Job Invoices */
  on(jobsActions.jobInvoicesData, state => ({
    ...state,
    modalDataIsLoading: true,
  })),

  on(jobsActions.jobInvoicesDataSuccess, (state, { data}) => ({
    ...state,
    jobInvoicesList: data,
    modalDataIsLoading: false,
  })),

  /** Create Job Invoice */
  on(jobsActions.createJobInvoice, state => ({
    ...state,
    spinner: true,
    isDataLoadedAfterAction: false
  })),

  on(jobsActions.createJobInvoiceSuccess, (state, { transaction } ) => ({
    ...state,
    jobInvoice: transaction,
    spinner: false,
    isDataLoadedAfterAction: true
  })),

  on(jobsActions.createJobInvoiceFailure, state => ({
    ...state,
    spinner: false
  })),
);
