import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as transactionsActions from '../../core/store/transactions/transactions.actions';
import * as accountsActions from '../../core/store/accounts/accounts.actions';
import * as organizationsActions from '../../core/store/organizations/organizations.actions';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { LogService } from '../../shared/logger/services/log.service';
import { ApplicationInsightsService } from '../../shared/services/application-insights.service';
import { tap } from 'rxjs/operators';

const HTTP_REFRESH_TOKEN_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  }),
  params: { ['key']: environment.firebase.apiKey }
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  path = environment.apiUrl;

  constructor(
    protected injector: Injector,
    private store: Store,
    private router: Router,
    private http: HttpClient,
    private lSService: LocalStorageService,
    private logger: LogService,
    private applicationInsightsService: ApplicationInsightsService
  ) {
  }

  refreshToken(refreshData: any): Observable<any> {
    const body = new HttpParams()
      .set('refresh_token', refreshData.refresh_token)
      .set('grant_type', 'refresh_token');
    this.logger.log('Service Call: Refresh Token');
    return this.http.post<any>(environment.refreshTokenEndpoint, body, HTTP_REFRESH_TOKEN_OPTIONS)
      .pipe(tap(() => this.logger.log('Service Call Complete: Refresh Token')));
  }

  logout(): void {
    this.applicationInsightsService.clearUserId();
    this.router.navigate(['/auth/sign-in']).then(() => {
      this.store.dispatch(transactionsActions.cleanState());
      this.store.dispatch(accountsActions.cleanState());
      this.store.dispatch(organizationsActions.cleanState());
      this.lSService.removeToken();
      this.lSService.removeRefreshToken();
      this.lSService.removeUserData();
      this.lSService.removeFeatureFlags();
      this.lSService.removeCurrentOrgDataExceptId();
      this.lSService.removeLedgersFilterData();
    });
  }

  getUserSettings(): Observable<any> {
    this.logger.log('Service Call: Get User Settings');
    return this.http.get(
      this.path + 'User/Settings'
    ).pipe(tap(() => this.logger.log('Service Call Complete: Get User Settings')));
  }
}
