import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { InvoiceModel } from '../../interfaces/invoice.interface';
import { LogService } from '../../../shared/logger/services/log.service';
import { EditChargeDto, AddJobDto, ChargeModel, JobModel } from '../../interfaces/job.interface';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { TransactionModel } from '../../interfaces/transaction.interface';

@Injectable({
  providedIn: 'root'
})
export class JobApiService {

  jobPath = environment.apiUrl + 'Job';
  chargesPath = environment.apiUrl + 'Charges';

  constructor(
    private http: HttpClient,
    private logger: LogService,
    private lSService: LocalStorageService
  ) { }

  getJobs(orgId: string): Observable<JobModel[]> {
    this.logger.log('Service Call: Get Jobs');
    return this.http.get<JobModel[]>(
      this.jobPath,
      {
        params: { OrgId: orgId },
      },
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Jobs')));
  }

  addJob(payload: AddJobDto): Observable<JobModel> {
    this.logger.log('Service Call: Add Job');
    return this.http.post<JobModel>(
      this.jobPath,
      payload,
      {
        params: { OrgId: this.lSService.getCurrentOrg().id }
      }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Add Job')));
  }

  editJob(payload: JobModel): Observable<JobModel> {
    this.logger.log('Service Call: Edit Job');
    return this.http.put<JobModel>(
      this.jobPath,
      payload,
      {
        params: { OrgId: this.lSService.getCurrentOrg().id }
      }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Edit Job')));
  }

  deleteJob(jobId: string): Observable<boolean> {
    this.logger.log('Service Call: Delete Job');
    return this.http.delete<boolean>(
      `${this.jobPath}/${jobId}`,
      {
        params: { OrgId: this.lSService.getCurrentOrg().id }
      }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Delete Job')));
  }

  getCharges(orgId: string, jobId: string): Observable<ChargeModel[]> {
    this.logger.log('Service Call: Get Charges');
    return this.http.get<ChargeModel[]>(
      this.chargesPath + `/${jobId}`,
      {
        params: { OrgId: orgId },
      },
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Charges')));
  }

  putCharges(jobId: string, editedCharge: EditChargeDto[]): Observable<ChargeModel[]> {
    this.logger.log('Service Call: Edit Charges');
    return this.http.put<ChargeModel[]>(
      this.chargesPath + `/${jobId}`,
      editedCharge,
      {
        params: { OrgId: this.lSService.getCurrentOrg().id },
      },
    ).pipe(tap(() => this.logger.log('Service Call Complete: Edit Charges')));
  }

  createJobInvoice(jobId: string, chargesIds: string[], groupBy: string): Observable<InvoiceModel> {
    this.logger.log('Service Call: Create Job Invoice');
    return this.http.post<InvoiceModel>(
      this.jobPath + `/${jobId}/Invoice`,
      chargesIds,
      {
        params: { OrgId: this.lSService.getCurrentOrg().id, groupBy }
      },
    ).pipe(tap(() => this.logger.log('Service Call Complete: Create Job Invoice')));
  }

  getJobInvoices(orgId: string, jobId: string): Observable<InvoiceModel[]> {
    this.logger.log('Service Call: Get Job Invoices');
    return this.http.get<InvoiceModel[]>(
      this.jobPath + `/${jobId}/Invoices`,
      {
        params: { OrgId: this.lSService.getCurrentOrg().id}
      },
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Job Invoices')));
  }

}
