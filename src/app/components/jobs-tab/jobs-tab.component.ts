import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material/dialog';

import { ModalClientsComponent } from '../modal-clients/modal-clients.component';
import * as clientsActions from '../../core/store/clients/clients.actions';
import * as clientsSelectors from '../../core/store/clients/clients.selectors';
import { JobModel } from '../../core/interfaces/job.interface';
import { ModalMode } from '../../core/constants/transaction.constants';
import { ModalClientsService } from '../../core/services/state/clients/modal-clients.service';
import { IClientsState } from '../../core/store/clients/clients.reducer';
import { ModalModeService } from '../../shared/services/modal-mode.service';
import { JobActionsService } from '../../core/services/state/job/job-actions.service';
import { emptyContentJob } from '../../core/constants/empty-content.constant';
import { EmptyContentModel } from '../../core/interfaces/empty-content.interface';

@Component({
  selector: 'app-jobs-tab',
  templateUrl: './jobs-tab.component.html',
  styleUrls: ['./jobs-tab.component.scss']
})
export class JobsTabComponent implements OnInit, OnDestroy {

  @Output() closeModal = new EventEmitter();

  columns: string[];
  formControl: FormControl = this.fb.control(null);
  checkboxControl: FormControl = this.fb.control(false);
  clientJobs: JobModel[];
  total = 0;
  emptyContentJob: EmptyContentModel = emptyContentJob;

  tableFormGroupRows$ = new BehaviorSubject<FormGroup[]>(null);
  subscription$ = new Subject();
  jobsIsLoading$: Observable<boolean> = this.clientsStore.select(clientsSelectors.selectIsModalDataLoading);
  jobsList$: Observable<JobModel[]> = this.clientsStore.select(clientsSelectors.selectClientJobs);
  showCompleted$ = new BehaviorSubject(false);

  get showCompleted(): boolean {
    return this.showCompleted$.value;
  }

  get modalMode(): ModalMode {
    return this.modalModeService.getModalMode();
  }

  setShowCompleted(isShow: boolean): void {
    this.showCompleted$.next(isShow);
  }

  constructor(
    public modalClientsService: ModalClientsService,
    public dialogRef: MatDialogRef<ModalClientsComponent>,
    private fb: FormBuilder,
    private clientsStore: Store<IClientsState>,
    private modalModeService: ModalModeService,
    private jobActionsService: JobActionsService
  ) {

    /** Get Client Jobs Data For Jobs Tab */
    this.clientsStore.dispatch(clientsActions.clientJobs({
      clientId: this.modalClientsService.getCurrentClient().id
    }));

    this.jobsList$.pipe(
      filter(res => Boolean(res)),
      takeUntil(this.subscription$)
    )
      .subscribe((jobs: JobModel[]) => {
        this.clientJobs = jobs;
        this.calculateTotal(jobs);
        this.setTableData();
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  setTableData(): void {
    this.tableFormGroupRows$.next(this.fillJobsGroups(this.clientJobs));
    this.columns = ['remove', 'status', 'name', 'startDate', 'endDate', 'reference', 'totalCharges'];
  }

  fillJobsGroups(rows: JobModel[]): FormGroup[] {
    return rows.map((row: JobModel) => this.fb.group({
      status: new FormControl(row.status, [Validators.required]),
      startDate: new FormControl(row.startDate, [Validators.required]),
      endDate: new FormControl(row.endDate, [Validators.required]),
      name: new FormControl(row.name, [Validators.required]),
      reference: new FormControl(row.reference, [Validators.required]),
      totalCharges: new FormControl(row.amount, [Validators.required]),
      id: new FormControl(row.id)
    }));
  }

  calculateTotal(lines: JobModel[]): void {
    let total = 0;
    lines.forEach((line: JobModel) => {
      total += Number(line.amount);
    });
    this.total = total;
  }

  clickOnRow(event: FormGroup): void {
    const selectedJob: JobModel = this.clientJobs.find((job: JobModel) => job.id === event.value.id);

    if (selectedJob) {
      this.jobActionsService.viewJob(selectedJob);
      this.dialogRef.close();
    }
  }

  cancelButtonClick(): void {
    this.closeModal.emit();
  }
}
