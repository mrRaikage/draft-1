import { Injectable } from '@angular/core';

import { OrganizationModel, OrganizationSettingsModel } from '../../core/interfaces/organizations.interface';
import { FeatureFlagsModel } from '../interfaces/feature-flags.interface';
import { UserModel } from '../interfaces/user-data.interface';
import { LedgerParamsModel } from '../../interfaces/ledger.interface';
import { AccountModel } from '../../core/interfaces/account.interface';

const CURRENT_ORG = 'current_org';
const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const USER = 'user';
const FEATURE_FLAGS = 'feature_flags';

const LEDGERS_FILTER_TAB_DATA = 'ledgers_filter_tab_data';
const SELECTED_ACCOUNTS = 'selected_accounts';

export const INCOME_STATEMENT_PERIOD = 'income_statement_period';
export const BALANCE_REPORT_DATE = 'balance_report_date';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {}

  /** Organizations */
  setCurrentOrg(org: OrganizationModel): void {
    localStorage.setItem(CURRENT_ORG, JSON.stringify(org));
  }

  getCurrentOrg(): OrganizationModel {
    return JSON.parse(localStorage.getItem(CURRENT_ORG));
  }

  removeCurrentOrgDataExceptId(): void {
    const orgData: OrganizationModel = { id: this.getCurrentOrg().id };
    localStorage.removeItem(CURRENT_ORG);
    this.setCurrentOrg(orgData);
  }

  updateCurrentOrgData(settingsData: OrganizationSettingsModel): void {
    const orgData: OrganizationModel = this.getCurrentOrg();
    const org: OrganizationModel = {
      ...orgData,
      name: settingsData.orgName,
      settings: {
        ...settingsData
      }
    };
    this.setCurrentOrg(org);
  }

  /** User */
  setUserData(data: UserModel): void {
    localStorage.setItem(USER, JSON.stringify(data));
  }

  getUserData(): UserModel {
    return JSON.parse(localStorage.getItem(USER));
  }

  updateUserName(name: string): void {
    const userData: UserModel = this.getUserData();
    userData.displayName = name;
    this.setUserData(userData);
  }

  removeUserData(): void {
    localStorage.removeItem(USER);
  }

  /** Token */
  setToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN, token);
  }

  getToken(): string {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  removeToken(): void {
    localStorage.removeItem(ACCESS_TOKEN);
  }

  /** Refresh Token */
  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  }

  getRefreshToken(): string {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN);
  }

  /** Feature Flags */
  setFeatureFlags(featureFlags: FeatureFlagsModel): void {
    localStorage.setItem(FEATURE_FLAGS, JSON.stringify(featureFlags));
  }

  getFeatureFlags(): FeatureFlagsModel {
    return JSON.parse(localStorage.getItem(FEATURE_FLAGS));
  }

  removeFeatureFlags(): void {
    localStorage.removeItem(FEATURE_FLAGS);
  }

  /** Reports */
  setIncomeStatementPeriod({ from, to }: { from: string; to: string }): void {
    localStorage.setItem(INCOME_STATEMENT_PERIOD, JSON.stringify({ from, to }));
  }

  getIncomeStatementPeriod(): { from: string; to: string } {
    return JSON.parse(localStorage.getItem(INCOME_STATEMENT_PERIOD));
  }

  setBalanceReportDate({ date }: { date: string }): void {
    localStorage.setItem(BALANCE_REPORT_DATE, date);
  }

  getBalanceReportDate(): string {
    return localStorage.getItem(BALANCE_REPORT_DATE);
  }

  /** Ledgers Filter Tab */
  setLedgersFilterData(params: LedgerParamsModel): void {
    localStorage.setItem(LEDGERS_FILTER_TAB_DATA, JSON.stringify(params));
  }

  getLedgersFilterData(): LedgerParamsModel | undefined {
    return JSON.parse(localStorage.getItem(LEDGERS_FILTER_TAB_DATA));
  }

  removeLedgersFilterData(): void {
    return localStorage.removeItem(LEDGERS_FILTER_TAB_DATA);
  }

  /** */
  hasItem(itemName: string): boolean {
    return !!localStorage.getItem(itemName);
  }
}
