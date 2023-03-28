import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';

import { LocalStorageService } from '../services/local-storage.service';
import { LogService } from '../logger/services/log.service';
import { environment } from '../../../environments/environment';
import { IAuthState } from '../../auth/store/auth.reducer';
import * as authActions from '../../auth/store/auth.actions';
import * as authSelectors from '../../auth/store/auth.selectors';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  jwtHelper = new JwtHelperService();
  tokenIsRefreshed: boolean;

  constructor(
    private lSService: LocalStorageService,
    private logger: LogService,
    private authStore: Store<IAuthState>,
    private authService: AuthService
  ) {
    this.authStore.select(authSelectors.selectTokenIsRefreshed)
      .subscribe(tokenIsRefreshed => this.tokenIsRefreshed = tokenIsRefreshed);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): any {

    const token = this.lSService.getToken();
    const refreshToken = this.lSService.getRefreshToken();

    const tokenExpirationDate = moment(this.jwtHelper.getTokenExpirationDate(token));
    const tokenExpired = this.jwtHelper.isTokenExpired(token);
    const tokenExpiration = moment.duration(tokenExpirationDate.diff(moment())).asMinutes();

    if ((tokenExpired || tokenExpiration < 1) && this.tokenIsRefreshed) {
      return this.authStore.dispatch(authActions.refreshToken({ refreshToken }));
    }

    if (token && !request.url.includes(environment.refreshTokenEndpoint)) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });
    }

    request = request.clone({
      setHeaders: {
        Accept: 'application/json'
      }
    });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => event),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
        }

        if (error.status === 400 && error.url.includes('securetoken.googleapis')) {
          this.logger.log('JWT Token Expired');
          this.authService.logout();
        }

        return throwError(error);
      }));
  }
}
