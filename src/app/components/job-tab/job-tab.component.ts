import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import * as moment from 'moment';
import { MatDialogRef } from '@angular/material/dialog';

import { SelectOptGroupQuickAddComponent } from '../../shared/components/form-controls/select-opt-group-quick-add/select-opt-group-quick-add.component';
import { ClientsActionsService } from '../../core/services/state/clients/clients-actions.service';
import * as jobActions from '../../core/store/job/job.actions';
import * as jobSelectors from '../../core/store/job/job.selectors';
import * as clientsActions from '../../core/store/clients/clients.actions';
import * as clientsSelectors from '../../core/store/clients/clients.selectors';
import { ModalJobService } from '../../core/services/state/job/modal-job.service';
import { ModalMode } from '../../core/constants/transaction.constants';
import { ISelectListGroup, ISelectListItem } from '../../shared/interfaces/select-control.interface';
import { ModalJobComponent } from '../modal-job/modal-job.component';
import { AddJobDto, JobModel } from '../../core/interfaces/job.interface';
import { IJobsState } from '../../core/store/job/job.reducer';
import { ModalModeService } from '../../shared/services/modal-mode.service';
import { JobActionsService } from '../../core/services/state/job/job-actions.service';
import { ClientModel } from '../../core/interfaces/clients.interface';
import { IClientsState } from '../../core/store/clients/clients.reducer';
import { StatusList, statusList } from '../../core/constants/job.constants';

@Component({
  selector: 'app-job-tab',
  templateUrl: './job-tab.component.html',
  styleUrls: ['./job-tab.component.scss']
})
export class JobTabComponent implements OnInit, OnDestroy {

  @Output() closeModal = new EventEmitter<any>();

  form: FormGroup;
  currentJob: JobModel;
  clients: ClientModel[];
  clientsSelectList: ISelectListGroup<ClientModel[]>[];
  statusListValue: ISelectListItem<string>[];
  clients$: Observable<ClientModel[]> = this.clientsStore.select(clientsSelectors.selectClients);

  subscription$ = new Subject();
  spinnerStarted$ = this.jobsStore.select(jobSelectors.selectSpinner);

  @ViewChild('quickAddClientComp') quickAddClientComp: SelectOptGroupQuickAddComponent;

  get modalMode(): ModalMode {
    return this.modalModeService.getModalMode();
  }

  constructor(
    public dialogRef: MatDialogRef<ModalJobComponent>,
    private modalJobService: ModalJobService,
    private modalModeService: ModalModeService,
    private fb: FormBuilder,
    private jobsStore: Store<IJobsState>,
    private clientsStore: Store<IClientsState>,
    private cdr: ChangeDetectorRef,
    private jobActionService: JobActionsService,
    private clientActionsService: ClientsActionsService
  ) {

    /** Get Current Job and Clients */
    this.modalJobService.currentJob$
      .pipe(
        takeUntil(this.subscription$),
        withLatestFrom(this.clientsStore.select(clientsSelectors.selectClients).pipe(filter(res => Boolean(res))))
      )
      .subscribe(([currentJob, clients]: [JobModel, ClientModel[]]) => {
        this.currentJob = currentJob;
        this.clients = clients;

        this.clientsStore.dispatch(clientsActions.clientById({ clientId: this.currentJob.clientId }));

        this.setClientsSelectList(this.clients);
        this.fillFormGroup(this.currentJob, this.getClientById(this.clients, this.currentJob.clientId));
      });

    /** Update clients list after quick add */
    this.clientsStore.select(clientsSelectors.selectIsLoadAfterAction).pipe(
      takeUntil(this.subscription$),
      filter(res => Boolean(res)),
      withLatestFrom(this.clientsStore.select(clientsSelectors.selectClients))
    )
      .subscribe(([, clients]: [boolean, ClientModel[]]) => {
        this.clients = clients;
        this.setClientsSelectList(clients);
      });
    this.statusListValue = Object.values(statusList);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  editButtonClick(): void {
    this.modalModeService.setModalMode(ModalMode.Edit);
  }

  saveButtonClick(): void {
    if (this.form.invalid) {
      return;
    }

    if (this.modalMode === 'Add') {
      const addJobData: AddJobDto = this.touchedAddJob(this.form.value);
      this.jobsStore.dispatch(jobActions.addJob({
        data: addJobData
      }));
    }

    if (this.modalMode === 'Edit') {
      const editJobData: JobModel = this.touchedEditJob(this.form.value, this.currentJob);
      this.jobsStore.dispatch(jobActions.editJob({
        data: editJobData
      }));
    }

    this.jobsStore.select(jobSelectors.selectIsDataLoadedAfterAction)
      .pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res)),
        withLatestFrom(
          this.jobsStore.select(jobSelectors.selectCurrentJob)
        )
      )
      .subscribe(([, data]: [any, JobModel]) => {
        this.modalJobService.setCurrentJob(data);
        this.modalModeService.setModalMode(ModalMode.View);
      });
  }

  setClientsSelectList(clients: ClientModel[]): void {
    this.clientsSelectList = [{ displayName: 'Clients', children: clients }];
  }

  touchedAddJob(formData): AddJobDto {
    return {
      name: formData.name,
      billTo: formData.billTo,
      reference: formData.reference,
      clientId: formData.client.id,
      startDate: formData.startDate ? moment(formData.startDate).format('YYYY-MM-DD') : null,
      endDate: formData.endDate ? moment(formData.endDate).format('YYYY-MM-DD') : null,
      details: formData.details,
      status: formData.status
    };
  }

  touchedEditJob(formData, currentJob: JobModel): JobModel {
    return {
      ...currentJob,
      name: formData.name,
      billTo: formData.billTo,
      reference: formData.reference,
      clientId: formData.client.id,
      startDate: formData.startDate ? moment(formData.startDate).format('YYYY-MM-DD') : null,
      endDate: formData.endDate ? moment(formData.endDate).format('YYYY-MM-DD') : null,
      details: formData.details,
      status: formData.status
    };
  }

  getClientById(clients, clientId): ClientModel {
    return clients.find(client => client.id === clientId);
  }

  fillFormGroup(currentJob: JobModel, client: ClientModel): void {
    this.form = this.fb.group({
      client: new FormControl(client ? client : null, [Validators.required]),
      name: new FormControl(currentJob.name, [Validators.required]),
      billTo: new FormControl(currentJob.billTo),
      details: new FormControl(currentJob.details),
      startDate: new FormControl(currentJob.startDate),
      endDate: new FormControl(currentJob.endDate),
      reference: new FormControl(currentJob.reference),
      status: new FormControl(currentJob.status ? currentJob.status : StatusList.InProgress)
    });

    if (!client && this.modalMode !== 'Add') {
      this.setCurrentClient();
    }
  }

  setError(control: AbstractControl, isError): void {
    control.setErrors(isError ? { incorrect: true } : null);
  }

  setCurrentClient(): void {
    this.clientsStore.select(clientsSelectors.selectClient)
      .pipe(takeUntil(this.subscription$), filter(res => Boolean(res)))
      .subscribe((client: ClientModel) => {
        this.setClientsSelectList([...this.clients, client]);
        this.form.get('client').setValue(client);
      });
  }

  cancelButtonClick(): void {
    if (this.modalMode === 'Add' || this.modalMode === 'View') {
      this.dialogRef.close();
    }

    if (this.modalMode === 'Edit') {
      this.modalModeService.setModalMode(ModalMode.View);
      this.fillFormGroup(this.currentJob, this.getClientById(this.clients, this.currentJob.clientId));
    }
  }

  deleteButtonClick(): void {
    this.jobActionService.deleteJob(this.currentJob.id, this.dialogRef);
  }

  quickAddClient(newClient: string): void {
    this.clientsStore.dispatch(clientsActions.addClient({ addClient: { name: newClient } }));
    this.clientsStore.select(clientsSelectors.selectClient)
      .pipe(filter(res => Boolean(res)), take(1))
      .subscribe((client: ClientModel) => {
        this.form.get('client').setValue(client);
        this.quickAddClientComp.closePanel();
      });
  }

  openClient(): void {
    const clientId = this.form.controls.client.value.id;

    this.clients$
      .pipe(filter(res => Boolean(res)), take(1))
      .subscribe(
        clients => {
          const clientModel = clients.find(client => client.id === clientId);
          this.dialogRef.close();
          this.clientActionsService.viewClient(clientModel);
        },
        error => {
          console.log(error);
          console.log('The client with this Id did not found');
        }
      );
  }
}
