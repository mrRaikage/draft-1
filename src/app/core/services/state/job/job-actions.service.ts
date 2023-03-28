import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';

import { ModalJobComponent } from '../../../../components/modal-job/modal-job.component';
import { ModalJobService } from './modal-job.service';
import { ModalMode } from '../../../constants/transaction.constants';
import { JobModel } from '../../../interfaces/job.interface';
import { ModalModeService } from '../../../../shared/services/modal-mode.service';
import { ModalConfirmComponent } from '../../../../shared/components/modal-confirm/modal-confirm.component';
import { ModalConfirmData, ModalConfirmType } from '../../../../shared/interfaces/modal-confirm.interface';
import * as jobActions from '../../../store/job/job.actions';
import * as jobSelectors from '../../../store/job/job.selectors';
import { IJobsState } from '../../../store/job/job.reducer';

@Injectable({
  providedIn: 'root'
})
export class JobActionsService {

  constructor(
    private dialog: MatDialog,
    private modalJobService: ModalJobService,
    private modalModeService: ModalModeService,
    private jobStore: Store<IJobsState>
  ) { }

  addJob(): void {
    const emptyJobModel: JobModel = {
      billTo: null,
      clientId: null,
      startDate: null,
      endDate: null,
      details: null,
      id: null,
      name: null,
      reference: null,
      status: null,
      amount: null
    };
    this.modalJobService.setCurrentJob(emptyJobModel);
    this.modalModeService.setModalMode(ModalMode.Add);
    this.openModal();
  }

  viewJob(jobModel: JobModel): void {
    this.modalJobService.setCurrentJob(jobModel);
    this.modalModeService.setModalMode(ModalMode.View);
    this.openModal();
  }

  editJob(jobModel: JobModel): void {
    this.modalJobService.setCurrentJob(jobModel);
    this.modalModeService.setModalMode(ModalMode.Edit);
  }

  deleteJob(jobId: string, dialogRef: MatDialogRef<ModalJobComponent>): void {
    this.dialog.open(ModalConfirmComponent, {
      height: '300px',
      width: '440px',
      autoFocus: false,
      data: {
        text: `Are you sure you want to delete this job?`,
        submitName: 'Delete',
        type: ModalConfirmType.DELETE,
        spinner$: this.jobStore.select(jobSelectors.selectDeleteSpinner),
        actionSuccess$: this.jobStore.select(jobSelectors.selectIsDataLoadedAfterAction),
        action: () => this.jobStore.dispatch(jobActions.deleteJob({ jobId })),
      } as ModalConfirmData
    })
      .afterClosed()
      .pipe(take(1), filter(res => Boolean(res)))
      .subscribe(() => dialogRef.close());
  }

  openModal(): void {
    this.dialog.open(ModalJobComponent, {
      width: '980px',
      height: 'auto',
      position: { top: '80px' },
    });
  }
}
