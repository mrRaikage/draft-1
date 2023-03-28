import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LedgerDataModel } from '../../interfaces/ledger.interface';
import { LedgerParamsModel } from '../../interfaces/ledger.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LedgerApiService {

  path = environment.apiUrl + 'Ledger';

  constructor(private http: HttpClient) { }

  getLedgerByParams(orgId: string, params?: LedgerParamsModel, url?: string): Observable<any> {
    if (params) {
      let parameters = new HttpParams();
      parameters = parameters.set('OrgId', orgId.toString());

      if (!parameters.has('AccountIds')) {
        for (const account of params.AccountIds ){
          parameters = parameters.append('AccountIds', account.id);
        }
      }

      parameters = parameters.set('MinDate', params.MinDate.toString());
      parameters = parameters.set('MaxDate', params.MaxDate.toString());
      parameters = parameters.set('Page', params.Page.toString());
      parameters = parameters.set('Limit', params.Limit.toString());
      parameters = parameters.set('Term', params.Term);

      return this.http.get<LedgerDataModel>(this.path, {params: parameters});
    } else if (url) {
      return this.http.get<LedgerDataModel>(url);
    }
  }
}

