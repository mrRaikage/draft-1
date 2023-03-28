import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import {
  AddAccountDto,
  AccountModel,
  AccountTypeModel,
  EditAccountDto
} from '../../interfaces/account.interface';
import { environment } from '../../../../environments/environment';
import { sortArrayByProperty } from '../../../shared/utils/functions/helper.functions';
import { LogService } from '../../../shared/logger/services/log.service';

@Injectable({
  providedIn: 'root'
})
export class AccountApiService {
  path = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private logger: LogService
  ) { }

  getAccounts(orgId: string): Observable<AccountModel[]> {
    this.logger.log('Service Call: Get Accounts');
    return this.http.get<AccountModel[]>(
      this.path + 'Accounts',
      { params: { OrgId: orgId } }
    )
      .pipe(
        tap(() => this.logger.log('Service Call Complete: Get Accounts')),
        map((accounts: AccountModel[]) => sortArrayByProperty<AccountModel>(accounts, 'code'))
      );
  }

  addAccount(data: AddAccountDto, orgId: string): Observable<AccountModel> {
    this.logger.log('Service Call: Add Account');
    return this.http.post<AccountModel>(
      this.path + 'Accounts',
      data,
      { params: { OrgId: orgId } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Add Account')));
  }

  editAccount(data: EditAccountDto, orgId: string): Observable<AccountModel> {
    this.logger.log('Service Call: Edit Account');
    return this.http.put<AccountModel>(
      this.path + 'Accounts',
      data,
      { params: { OrgId: orgId } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Edit Account')));
  }

  deleteAccount(id: string, orgId: string): Observable<any> {
    this.logger.log('Service Call: Delete Account');
    return this.http.delete(
      this.path + 'Accounts' + `/${id}`,
      { params: { OrgId: orgId } }
    ).pipe(tap(() => this.logger.log('Service Call Complete: Delete Account')));
  }

  getAccountTypes(): Observable<AccountTypeModel[]> {
    this.logger.log('Service Call: Get Account Types');
    return this.http.get<AccountTypeModel[]>(
      this.path + 'AccountTypes'
    ).pipe(
      tap(() => this.logger.log('Service Call Complete: Get Account Types')),
      map((types: AccountTypeModel[]) => sortArrayByProperty<AccountTypeModel>(types, 'name'))
    );
  }
}
