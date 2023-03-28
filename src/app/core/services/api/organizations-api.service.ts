import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import {
  OrganizationModel,
  OrganizationSettingsModel,
  OrganizationUserModel
} from '../../interfaces/organizations.interface';
import { LogService } from '../../../shared/logger/services/log.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsApiService {

  path = 'Org';

  constructor(
    private http: HttpClient,
    private logger: LogService,
  ) { }

  /** Organizations */
  getOrganizations(): Observable<OrganizationModel[]> {
    this.logger.log('Service Call: Get Organizations');
    return this.http.get<OrganizationModel[]>(environment.apiUrl + this.path)
      .pipe(tap(() => this.logger.log('Service Call Complete: Get Organizations')));
  }

  addOrganization(orgName: string): Observable<any> {
    this.logger.log('Service Call: Add Organization');
    return this.http.post(
      environment.apiUrl + this.path,
      {},
      { params: { OrgName: orgName } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Add Organizations')));
  }

  /** Organization settings */
  getOrganizationSettings(orgId: string): Observable<OrganizationSettingsModel> {
    this.logger.log('Service Call: Get Organization Settings');
    return this.http.get<OrganizationSettingsModel>(
      environment.apiUrl + this.path + '/Settings',
      { params: { OrgId: orgId } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Organization Settings')));
  }

  editOrganizationSettings(orgSettings: OrganizationSettingsModel, orgId: string): Observable<OrganizationSettingsModel> {
    this.logger.log('Service Call: Edit Organization Settings');
    return this.http.put<OrganizationSettingsModel>(
      environment.apiUrl + this.path + '/Settings',
      orgSettings,
      { params: { OrgId: orgId } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Edit Organization Settings')));
  }

  uploadOrganizationLogo(formData: FormData, orgId: string): Observable<any> {
    this.logger.log('Service Call: Upload Organization Logo');
    return this.http.post<any>(
      environment.apiUrl + this.path + '/Settings' + '/Logo',
      formData,
      { params: { OrgId: orgId } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Upload Organization Logo')));
  }

  /** Organization Users */
  getOrganizationUsers(orgId: string): Observable<OrganizationUserModel[]> {
    this.logger.log('Service Call: Get Organization Users');
    return this.http.get<OrganizationUserModel[]>(
      environment.apiUrl + this.path + '/Users',
      { params: { OrgId: orgId } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get Organization Users')));
  }

  addOrganizationUser(orgId: string, email: string): Observable<string> {
    this.logger.log('Service Call: Add Organization User');
    return this.http.post<string>(
      environment.apiUrl + this.path + '/InviteUser',
      {},
      { params: { OrgId: orgId, invitee: email } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Add Organization User')));
  }

  revokeOrganizationUser(orgId: string, email: string): Observable<string> {
    this.logger.log('Service Call: Revoke Organization User');
    return this.http.post<string>(
      environment.apiUrl + this.path + '/RevokeUser',
      {},
      { params: {OrgId: orgId, invitee: email} }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Revoke Organization User')));
  }
}
