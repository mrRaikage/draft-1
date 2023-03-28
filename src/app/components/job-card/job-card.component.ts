import { Component, Input, OnInit } from '@angular/core';

import { JobModel } from '../../core/interfaces/job.interface';
import { JobActionsService } from '../../core/services/state/job/job-actions.service';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.scss']
})
export class JobCardComponent implements OnInit {

  @Input() jobModel: JobModel;

  clientName: string;
  jobName: string;

  constructor(private jobActionsService: JobActionsService) {}

  ngOnInit(): void {
    this.clientName = this.jobModel.client.name;
    this.jobName = this.jobModel.name;
  }

  viewJobButtonClick(): void {
    this.jobActionsService.viewJob(this.jobModel);
  }
}
