import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { JobActionsService } from '../../core/services/state/job/job-actions.service';
import * as clientsSelectors from '../../core/store/clients/clients.selectors';
import * as jobSelectors from '../../core/store/job/job.selectors';
import { IOrganizationsState } from '../../core/store/organizations/organizations.reducer';
import { IJobsState } from '../../core/store/job/job.reducer';
import { JobModel } from '../../core/interfaces/job.interface';
import { emptyContentJob } from '../../core/constants/empty-content.constant';
import { EmptyContentModel } from '../../core/interfaces/empty-content.interface';
import { IClientsState } from '../../core/store/clients/clients.reducer';
import { ClientModel } from '../../core/interfaces/clients.interface';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {

  jobs$: Observable<JobModel[]> = combineLatest([
    this.jobStore.select<JobModel[]>(jobSelectors.selectJobData),
    this.clientsStore.select<ClientModel[]>(clientsSelectors.selectClients)
  ]).pipe(map(([jobs, clients]: [JobModel[], ClientModel[]]) => this.getJobs(jobs, clients)));

  jobsLoaded$: Observable<boolean> = this.jobStore.select(jobSelectors.selectIsJobsLoaded);
  emptyContentJob: EmptyContentModel = emptyContentJob;

  constructor(
    private jobActionsService: JobActionsService,
    private orgStore: Store<IOrganizationsState>,
    private jobStore: Store<IJobsState>,
    private clientsStore: Store<IClientsState>,
  ) {
  }

  ngOnInit(): void {
  }

  addJobButtonClick(): void {
    this.jobActionsService.addJob();
  }

  getJobs(jobs: JobModel[], clients: ClientModel[]): JobModel[] {
    return jobs.map(job => ({
      ...job,
      client: clients.find(client => client.id === job.clientId),
    }));
  }

}

