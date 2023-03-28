import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { fromPromise } from 'rxjs/internal-compatibility';
import firebase from 'firebase/app';
import * as moment from 'moment';

import * as authActions from './auth.actions';
import * as orgActions from '../../core/store/organizations/organizations.actions';
import * as clientsActions from '../../core/store/clients/clients.actions';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../../shared/interfaces/user-data.interface';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { LogService } from '../../shared/logger/services/log.service';
import * as transactionsActions from '../../core/store/transactions/transactions.actions';
import * as accountsActions from '../../core/store/accounts/accounts.actions';
import { ApplicationInsightsService } from '../../shared/services/application-insights.service';
import * as financialReportsActions from '../../core/store/financial-reports/financial-reports.actions';
import * as jobActions from '../../core/store/job/job.actions';
import * as assetActions from '../../core/store/asset/asset.actions';
import * as bankFeedsActions from '../../core/store/bank-feeds/bank-feeds.actions';
import * as invoicesActions from '../../core/store/invoices/invoices.actions';
import * as dashboardActions from '../../core/store/dashboard/dashboard.actions';

@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private fbAuth: AngularFireAuth,
    private lSService: LocalStorageService,
    private logger: LogService,
    private appInsightsService: ApplicationInsightsService
  ) {}

  signIn$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.signIn),
    switchMap(({ username, password, isRemember }) => {
      return fromPromise(this.fbAuth.signInWithEmailAndPassword(username, password))
        .pipe(
          map((data) => {
            const userData: UserModel = {
              displayName: data.user.displayName || data.user.email,
              email: data.user.email,
              bgColor: '6074F1',
              textColor: 'fff',
              logInWithGoogle: false,
              uid: data.user.uid
            };
            if (data.user['za']) {
              this.logger.log('JWT Token Retrieved');
            }
            this.lSService.setToken(data.user['za']);
            this.lSService.setRefreshToken(data.user.refreshToken);
            this.lSService.setUserData(userData);
            this.appInsightsService.setUserId(userData.uid);
            this.appInsightsService.logInSuccessful();
            return authActions.signInSuccess({ data: userData });
            }),
          catchError((err) => {
            const errorMessage = err.error ? err.error : 'Oops, login failed';
            this.toastr.error(errorMessage);
            return of(authActions.signInFailure());
          }),
      );
    }),
  ));

  signInWithGoogle$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.signInWithGoogle),
    switchMap(() => {
      return fromPromise(this.fbAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())).pipe(
        map((data) => {
          const userData: UserModel = {
            displayName: data.user.displayName || data.user.email,
            email: data.user.email,
            bgColor: '6074F1',
            textColor: 'fff',
            logInWithGoogle: true,
            uid: data.user.uid
          };
          if (data.user['za']) {
            this.logger.log('JWT Token Retrieved');
          }
          this.lSService.setToken(data.user['za']);
          this.lSService.setRefreshToken(data.user.refreshToken);
          this.lSService.setUserData(userData);
          this.appInsightsService.setUserId(userData.uid);
          this.appInsightsService.logInSuccessful();
          return authActions.signInSuccess({ data: userData });
        }),
        catchError((err) => {
          const errorMessage = err.error ? err.error : 'Oops, login failed';
          this.toastr.error(errorMessage);
          return of(authActions.signInFailure());
        }),
      );
    })
  ));

  signInSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.signInSuccess),
    switchMap(() => [
      authActions.userSettings(),
      orgActions.organizationsData({ redirect: true })
    ])
  ));

  signUp$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.signUp),
    switchMap(({ username, confirmPassword }) => {
      return fromPromise(this.fbAuth.createUserWithEmailAndPassword(username, confirmPassword)).pipe(
        map((data) => {
          const userData: UserModel = {
            displayName: data.user.displayName || data.user.email,
            email: data.user.email,
            bgColor: '6074F1',
            textColor: 'fff',
            logInWithGoogle: false,
            uid: data.user.uid
          };
          if (data.user['za']) {
            this.logger.log('JWT Token Retrieved');
          }
          this.lSService.setToken(data.user['za']);
          this.lSService.setRefreshToken(data.user.refreshToken);
          this.lSService.setUserData(userData);
          this.appInsightsService.setUserId(userData.uid);
          this.appInsightsService.logInSuccessful();
          return authActions.signUpSuccess({ data: userData });
        }),
        catchError((err) => {
          const errorMessage = err.error ? err.error : 'Oops, sign up request is failed';
          this.toastr.error(errorMessage);
          return of(authActions.signUpFailure());
        }),
      );
    }),
  ));

  signUpWithGoogle$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.signUpWithGoogle),
    switchMap(() => {
      return fromPromise(this.fbAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())).pipe(
        map((data) => {
          const userData: UserModel = {
            displayName: data.user.displayName || data.user.email,
            email: data.user.email,
            bgColor: '6074F1',
            textColor: 'fff',
            logInWithGoogle: true,
            uid: data.user.uid
          };
          if (data.user['za']) {
            this.logger.log('JWT Token Retrieved');
          }
          this.lSService.setToken(data.user['za']);
          this.lSService.setRefreshToken(data.user.refreshToken);
          this.lSService.setUserData(userData);
          this.appInsightsService.setUserId(userData.uid);
          this.appInsightsService.logInSuccessful();
          return authActions.signUpSuccess({ data: userData });
        }),
        catchError((err) => {
          const errorMessage = err.error ? err.error : 'Oops, sign up request is failed';
          this.toastr.error(errorMessage);
          return of(authActions.signUpFailure());
        }),
      );
    }),
  ));

  signUpSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.signUpSuccess),
    switchMap(() => [
      authActions.userSettings(),
      orgActions.organizationsData({ redirect: true })
    ])
  ));

  forgotPassword$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.forgotPassword),
    switchMap(({ email }) => {
      return fromPromise(this.fbAuth.sendPasswordResetEmail(email)).pipe(
        map(() => authActions.forgotPasswordSuccess()),
        catchError((err) => {
          const errorMessage = err.error ? err.error : 'Oops, forgot password request is failed';
          this.toastr.error(errorMessage);
          return of(authActions.forgotPasswordFailure());
        }),
      );
    }),
  ));

  forgotPasswordSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.forgotPasswordSuccess),
    tap(() => this.router.navigate(['auth/forgot-password-success']))
  ), { dispatch: false });

  changePassword$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.changePassword),
    switchMap(({ confirmPassword, navigateTo }) => {
      const user = firebase.auth().currentUser;
      return fromPromise(user.updatePassword(confirmPassword)).pipe(
        map(() => {
          this.toastr.success('Password Updated!');
          return authActions.changePasswordSuccess({ navigateTo });
        }),
        catchError((err) => {
          const errorMessage = err.error ? err.error : 'Oops, change password request is failed';
          this.toastr.error(errorMessage);
          return of(authActions.changePasswordFailure());
        }),
      );
    }),
  ));

  changePasswordSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.changePasswordSuccess),
    filter(res => Boolean(res.navigateTo)),
    tap(({ navigateTo }) => {
      this.router.navigate(['auth/change-password-success']);
    })
  ), { dispatch: false });

  /** Refresh Token */
  refreshToken$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.refreshToken),
    switchMap(({ refreshToken }) => this.authService.refreshToken({ refresh_token: refreshToken })
      .pipe(
        map((data) => authActions.refreshTokenSuccess({ data })),
        catchError((error) => {
          return of(authActions.refreshTokenFailure());
        }),
      )
    )
  ));

  refreshTokenSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.refreshTokenSuccess),
    switchMap(({ data }) => {
      this.lSService.setToken(data.access_token);
      this.lSService.setRefreshToken(data.refresh_token);
      this.logger.log('JWT Token Retrieved');
      this.appInsightsService.refreshTokenSuccessful();
      return [
        /** Actions must match with actions after the init app */
        orgActions.organizationsData({}),
        transactionsActions.transactionsData(),
        accountsActions.accountsData({}),
        orgActions.organizationSettings(),
        financialReportsActions.balanceSheetData({ date: this.lSService.getBalanceReportDate() }),
        financialReportsActions.profitAndLossData(this.lSService.getIncomeStatementPeriod()),
        jobActions.jobsData(),
        clientsActions.clients(),
        assetActions.assetData(),
        bankFeedsActions.getBankFeeds(),
        invoicesActions.invoicesData(),
        dashboardActions.revenueAndExpensesChartData()
    ];
    })
  ));

  changeUserName$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.changeUserName),
    switchMap(({ userName }) => {
      const currentUser = firebase.auth().currentUser;
      return fromPromise(currentUser.updateProfile({ displayName: userName }))
        .pipe(
          map(() => {
            this.toastr.success('User Name Updated!');
            this.lSService.updateUserName(firebase.auth().currentUser.displayName);
            return authActions.changeUserNameSuccess();
          }),
          catchError((err) => {
            const errorMessage = err.error ? err.error : 'Oops, User Name Not Updated';
            this.toastr.error(errorMessage);
            return of(authActions.changeUserNameFailure());
          }),
        );
    }),
  ));

  userSettings$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.userSettings),
    switchMap(() => this.authService.getUserSettings().pipe(
      map(({ featureFlags }) => {
        this.lSService.setFeatureFlags(featureFlags);
        return authActions.userSettingsSuccess();
      }),
      catchError(() => of(authActions.userSettingsFailure()))
    ))
  ));

}
