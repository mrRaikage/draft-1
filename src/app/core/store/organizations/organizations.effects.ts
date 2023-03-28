import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import firebase from 'firebase/app';

import * as authActions from '../../../auth/store/auth.actions';
import * as dashboardActions from '../dashboard/dashboard.actions';
import * as organizationsActions from './organizations.actions';
import * as transactionsActions from '../transactions/transactions.actions';
import * as accountsActions from '../accounts/accounts.actions';
import * as clientsActions from '../clients/clients.actions';
import * as priceBookActions from '../prce-book/price-book.actions';
import * as assetActions from '../asset/asset.actions';
import * as bankFeedsActions from '../bank-feeds/bank-feeds.actions';
import * as invoicesActions from '../invoices/invoices.actions';
import * as financialReportsActions from '../financial-reports/financial-reports.actions';
import * as jobsActions from '../job/job.actions';
import { OrganizationsApiService } from '../../services/api/organizations-api.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { ClientApiService } from '../../services/api/client-api.service';
import {
  OrganizationModel,
  OrganizationSettingsModel,
  OrganizationUserModel
} from '../../interfaces/organizations.interface';
import { TaxMode } from '../../constants/transaction.constants';
import { ErrorMessageService } from '../../services/api/error-message.service';

@Injectable()
export class OrganizationsEffects {

  constructor(
    private actions$: Actions,
    private toastr: ToastrService,
    private router: Router,
    private organizationsService: OrganizationsApiService,
    private clientApiService: ClientApiService,
    private lSService: LocalStorageService,
    private errorMessageService: ErrorMessageService
  ) {
  }

  organizationsData$ = createEffect(() => this.actions$.pipe(
    ofType(organizationsActions.organizationsData),
    switchMap(({ redirect }) => this.organizationsService.getOrganizations().pipe(
      map((data) => organizationsActions.organizationsDataSuccess({ data, redirect })),
      catchError(() => {
        return of(organizationsActions.organizationsDataFailure());
      })
    ))
  ));

  /** Organizations Data Success with redirect */
  organizationsDataSuccessWithAuth$ = createEffect(() => this.actions$.pipe(
    ofType(organizationsActions.organizationsDataSuccess),
    filter(({ redirect }) => redirect),
    map(({ data }) => {
      if (data) {
        const lastOrg: OrganizationModel = data[data.length - 1];
        const orgList: OrganizationModel[] = data;
        const existOrg: OrganizationModel = orgList.find((org: OrganizationModel) =>
          Boolean(this.lSService.getCurrentOrg() && org.id === this.lSService.getCurrentOrg().id));
        existOrg
          ? this.lSService.setCurrentOrg(existOrg)
          : this.lSService.setCurrentOrg(lastOrg);
        this.router.navigate(['/content/transactions']);
      } else {
        this.router.navigate(['/on-boarding-requirement']);
      }
      return authActions.stopSpinner();
    })
  ));

  /** Add First Organization */
  addFirstOrganization$ = createEffect(() => this.actions$.pipe(
    ofType(organizationsActions.addFirstOrganization),
    switchMap(({ displayName, orgName }) => {
      const currentUser = firebase.auth().currentUser;
      if (currentUser.displayName !== displayName) {
        currentUser.updateProfile({ displayName })
          .then(() => this.lSService.updateUserName(displayName))
          .catch((err) => {
            this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Name Not Changed`);
          });
      }

      return this.organizationsService.addOrganization(orgName).pipe(
        map((data) => organizationsActions.addFirstOrganizationSuccess({ data })),
        catchError((err) => {
          this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Organization Not Added`);
          return of(organizationsActions.addFirstOrganizationFailure());
        })
      );
    })
  ));

  addFirstOrganizationSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(organizationsActions.addFirstOrganizationSuccess),
    map(({ data }) => {
      this.lSService.setCurrentOrg(data);
      this.router.navigate(['/content/transactions']);
    })
  ), { dispatch: false });

  addOrganization$ = createEffect(() => this.actions$.pipe(
    ofType(organizationsActions.addOrganization),
    switchMap(({ orgName }) => this.organizationsService.addOrganization(orgName).pipe(
      map((data) => organizationsActions.addOrganizationSuccess({ data })),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Organization Not Added`);
        return of(organizationsActions.addOrganizationFailure());
      })
    ))
  ));

  addOrganizationSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(organizationsActions.addOrganizationSuccess),
    switchMap(({ data }) => [
      organizationsActions.organizationsData({ redirect: false }),
      organizationsActions.setCurrentOrganization({ org: data })
    ])
  ));

  /** Set Current Organization */
  setCurrentOrganization$ = createEffect(() => this.actions$.pipe(
    ofType(organizationsActions.setCurrentOrganization),
    switchMap(({ org }) => {
      this.lSService.setCurrentOrg(org);
      this.lSService.removeLedgersFilterData();
      return [
        organizationsActions.setCurrentOrganizationSuccess(),
        transactionsActions.transactionsData(),
        accountsActions.accountsData({}),
        organizationsActions.organizationSettings(),
        financialReportsActions.balanceSheetData({ date: this.lSService.getBalanceReportDate() }),
        financialReportsActions.profitAndLossData(this.lSService.getIncomeStatementPeriod()),
        organizationsActions.organizationUsers(),
        clientsActions.clients(),
        jobsActions.jobsData(),
        priceBookActions.orgPriceBook(),
        assetActions.assetData(),
        bankFeedsActions.getBankFeeds(),
        invoicesActions.invoicesData(),
        dashboardActions.revenueAndExpensesChartData()
      ];
    }),
    catchError(() => of(organizationsActions.setCurrentOrganizationFailure()))
  ));

  /** Get Organization Settings */
  organizationSettings$ = createEffect(() => this.actions$.pipe(
    ofType(organizationsActions.organizationSettings),
    switchMap(() => this.organizationsService.getOrganizationSettings(this.lSService.getCurrentOrg().id).pipe(
      map((orgSettings: OrganizationSettingsModel) => {
        const touchedSettings: OrganizationSettingsModel = {
          ...orgSettings,
          invoiceDefaultTaxMode: orgSettings.invoiceDefaultTaxMode || TaxMode.Exclusive
        };
        return organizationsActions.organizationSettingsSuccess({ orgSettings: touchedSettings });
      }),
      catchError(() => of(organizationsActions.organizationSettingsFailure()))
    ))
  ));

  organizationSettingsSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(organizationsActions.organizationSettingsSuccess),
    tap(({ orgSettings }) => {
      if (orgSettings) {
        this.lSService.updateCurrentOrgData(orgSettings);
      }
    })
  ), { dispatch: false });

  /** Edit Organization Settings */
  editOrganizationSettings$ = createEffect(() => this.actions$.pipe(
    ofType(organizationsActions.editOrganizationSettings),
    switchMap(({ orgSettings }) => this.organizationsService.editOrganizationSettings(orgSettings, this.lSService.getCurrentOrg().id).pipe(
      map(() => {
        this.toastr.success('Organization Settings Updated!');
        return organizationsActions.editOrganizationSettingsSuccess();
      }),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Organization Settings Not Updated`);
        return of(organizationsActions.editOrganizationSettingsFailure());
      })
    ))
  ));

  editOrganizationSettingsSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(organizationsActions.editOrganizationSettingsSuccess),
    map(() => organizationsActions.organizationSettings())
  ));

  /** Upload Organization Logo */
  uploadOrganizationLogo$ = createEffect(() => this.actions$.pipe(
    ofType(organizationsActions.uploadOrganizationLogo),
    switchMap(({ formData }) => this.organizationsService.uploadOrganizationLogo(formData, this.lSService.getCurrentOrg().id).pipe(
      map((res) => {
        this.toastr.success('Logo Added');
        return organizationsActions.uploadOrganizationLogoSuccess();
      }),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Logo Not Added`);
        return of(organizationsActions.uploadOrganizationLogoFailure());
      })
    ))
  ));

  /** Get Organization Users */
  organizationUsers$ = createEffect(() => this.actions$.pipe(
    ofType(organizationsActions.organizationUsers),
    switchMap(() => this.organizationsService.getOrganizationUsers(this.lSService.getCurrentOrg().id).pipe(
      map((orgUsers: OrganizationUserModel[]) => organizationsActions.organizationUsersSuccess({ orgUsers })),
      catchError(() => of(organizationsActions.organizationUsersFailure()))
    ))
  ));

  /** Add Organization Users */
  inviteOrganizationUser$ = createEffect(() => this.actions$.pipe(
    ofType(organizationsActions.inviteOrganizationUser),
    switchMap(({ email }) => this.organizationsService.addOrganizationUser(this.lSService.getCurrentOrg().id, email).pipe(
      map(() => {
        this.toastr.success('Invitation Has Been Sent');
        return organizationsActions.inviteOrganizationUserSuccess();
      }),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! Invitation Not Sent`);
        return of(organizationsActions.inviteOrganizationUserFailure());
      })
    ))
  ));

  inviteOrganizationUserSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(organizationsActions.inviteOrganizationUserSuccess),
    map(() => organizationsActions.organizationUsers())
  ));

  removeOrganizationUser$ = createEffect(() => this.actions$.pipe(
    ofType(organizationsActions.removeOrganizationUser),
    switchMap(({ email }) => this.organizationsService.revokeOrganizationUser(this.lSService.getCurrentOrg().id, email).pipe(
      map(() => {
        this.toastr.success('User Has Been Revoked');
        return organizationsActions.removeOrganizationUserSuccess();
      }),
      catchError((err) => {
        this.toastr.error(this.errorMessageService.getMessage(err) || `Oops! User Not Revoked`);
        return of(organizationsActions.removeOrganizationUserFailure());
      })
    ))
  ));

  removeOrganizationUserSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(organizationsActions.removeOrganizationUserSuccess),
    map(() => organizationsActions.organizationUsers())
  ));

}
