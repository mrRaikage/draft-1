import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { JobModel } from '../../../interfaces/job.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalJobService {

  private currentJobSubject: BehaviorSubject<JobModel> = new BehaviorSubject<JobModel>(null);
  public currentJob$: Observable<JobModel> = this.currentJobSubject.asObservable();

  constructor() { }

  public setCurrentJob(jobModel: JobModel) {
    this.currentJobSubject.next(jobModel);
  }

  public getCurrentJob(): JobModel {
    return this.currentJobSubject.value;
  }
}
