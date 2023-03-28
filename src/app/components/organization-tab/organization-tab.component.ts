import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

import { ISelectListItem } from '../../shared/interfaces/select-control.interface';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import {
  OrganizationModel,
  OrganizationSettingsModel
} from '../../core/interfaces/organizations.interface';
import { IOrganizationsState } from '../../core/store/organizations/organizations.reducer';
import {
  registeredForTaxList,
  yearEndMonthList
} from '../../core/constants/organization-settings.constants';
import { SettingsActionsService } from '../../core/services/state/settings/settings-actions.service';
import { SettingsStateService } from '../../core/services/state/settings/settings-state.service';
import { editOrganizationSettings } from '../../core/store/organizations/organizations.actions';
import {
  selectIsOrgSettingsSpinnerStarted,
  selectIsOrganizationsSettingsLoaded
} from '../../core/store/organizations/organizations.selectors';

@Component({
  selector: 'app-organization-tab',
  templateUrl: './organization-tab.component.html',
  styleUrls: ['./organization-tab.component.scss']
})
export class OrganizationTabComponent implements OnInit, OnDestroy {

  organizationsSettingsLoaded$ = this.orgStore.select(selectIsOrganizationsSettingsLoaded);
  subscription$ = new Subject();
  spinnerStarted$: Observable<boolean> = this.orgStore.select(selectIsOrgSettingsSpinnerStarted);

  form: FormGroup;
  taxRate: number;
  registeredForTaxList: ISelectListItem<boolean>[] = registeredForTaxList;
  yearEndDayList: ISelectListItem<number>[];
  yearEndMonthList: ISelectListItem<number>[] = yearEndMonthList;
  orgSettings: OrganizationSettingsModel;
  unsavedChanges = false;

  get currentOrg(): OrganizationModel {
    return this.lSService.getCurrentOrg();
  }

  get defaultYearEndDay(): number {
    return this.orgSettings.yearEndDay;
  }

  get defaultYearEndMonth(): number {
    return this.orgSettings.yearEndMonth;
  }

  get defaultTaxRegistered(): any {
    return this.orgSettings.taxRegistered;
  }

  constructor(
    private fb: FormBuilder,
    private lSService: LocalStorageService,
    public settingsStateService: SettingsStateService,
    private orgStore: Store<IOrganizationsState>,
    private settingsActionsService: SettingsActionsService
  ) {
    this.settingsStateService.currentOrgSettings$.pipe(
      takeUntil(this.subscription$),
      filter(res => Boolean(res))
    )
      .subscribe((orgSettings: OrganizationSettingsModel) => {
        this.orgSettings = orgSettings;
        this.fillForm();

        /** TODO: refactoring this method */
        this.form.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(() => {
          this.unsavedChanges = this.form.dirty;
        });
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  fillForm(): void {
    const daysInMonth = this.calculateDaysInMonth(this.defaultYearEndMonth);
    this.yearEndDayList = this.fillYearEndDayList(daysInMonth);

    this.form = this.fb.group({
      orgName: new FormControl(this.orgSettings.orgName),
      yearEndDay: new FormControl(this.defaultYearEndMonth === 0 ? 0 : this.defaultYearEndDay),
      yearEndMonth: new FormControl(this.defaultYearEndMonth),
      isRegisteredForTax: new FormControl(this.defaultTaxRegistered),
      taxNumber: new FormControl(this.orgSettings.taxNumber)
    });
  }

  saveChanges(): void {
    const form = this.form.value;
    const editedOrganizationSettings: OrganizationSettingsModel = {
      id: this.orgSettings.id,
      yearEndDay: form.yearEndDay,
      yearEndMonth: form.yearEndMonth,
      taxNumber: form.taxNumber || this.orgSettings.taxNumber,
      taxRegistered: form.isRegisteredForTax,
      taxRate: this.taxRate,
      invoiceFooter: this.orgSettings.invoiceFooter,
      invoiceAddress: this.orgSettings.invoiceAddress,
      invoiceTradingName: this.orgSettings.invoiceTradingName,
      invoicePaymentTerms: this.orgSettings.invoicePaymentTerms,
      orgId: this.orgSettings.orgId,
      orgName: form.orgName,
      invoiceGroupChargesByDate: this.orgSettings.invoiceGroupChargesByDate,
      logoSecureLink: this.orgSettings.logoSecureLink
    };
    this.orgStore.dispatch(editOrganizationSettings({ orgSettings: editedOrganizationSettings }));
    this.unsavedChanges = false;
  }

  canDeactivate(): Promise<boolean> {
    return this.settingsActionsService.openConfirmExitDialog();
  }

  calculateDaysInMonth(month: number): number {
    if (month !== 0) {
      const currentDate = moment();
      let year = moment().year();
      const diff = currentDate.diff(moment().month(month - 1));
      if (diff <= 0) {
        year = moment().year(year - 1).year();
      }
      return moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();
    }
    return 0;
  }

  handleMonthChange(): void {
    const form = this.form.value;
    const selectedMonth = form.yearEndMonth;
    const amountDaysInMonth = this.calculateDaysInMonth(selectedMonth);

    this.yearEndDayList = this.fillYearEndDayList(amountDaysInMonth);
    this.form.controls.yearEndDay.setValue(this.yearEndDayList[0].value);
  }

  fillYearEndDayList(amountDaysInMonth): ISelectListItem<number>[] {
    const arr = [{ value: 0, displayName: 'Not Selected' }];

    for (let i = 0; i <= amountDaysInMonth; i++) {
      if (i === 0) {
        continue;
      }
      arr.push({ value: i, displayName: `${i}` });
    }
    return arr;
  }
}
