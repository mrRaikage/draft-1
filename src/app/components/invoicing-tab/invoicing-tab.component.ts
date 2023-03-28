import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { paymentTermsList } from '../../core/constants/invoicing-settings.constants';
import { editOrganizationSettings } from '../../core/store/organizations/organizations.actions';
import { IOrganizationsState } from '../../core/store/organizations/organizations.reducer';
import {
  selectIsOrganizationsSettingsLoaded,
  selectIsOrgSettingsSpinnerStarted
} from '../../core/store/organizations/organizations.selectors';
import * as organizationsActions from '../../core/store/organizations/organizations.actions';
import { OrganizationSettingsModel } from '../../core/interfaces/organizations.interface';
import { ISelectListItem } from '../../shared/interfaces/select-control.interface';
import { SettingsStateService } from '../../core/services/state/settings/settings-state.service';
import { SettingsActionsService } from '../../core/services/state/settings/settings-actions.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { taxModel } from '../../core/constants/transaction.constants';

@Component({
  selector: 'app-invoicing-tab',
  templateUrl: './invoicing-tab.component.html',
  styleUrls: ['./invoicing-tab.component.scss']
})
export class InvoicingTabComponent implements OnInit, OnDestroy {

  unsavedChanges = false;

  organizationsSettingsLoaded$ = this.orgStore.select(selectIsOrganizationsSettingsLoaded);
  subscription$ = new Subject();
  spinnerStarted$: Observable<boolean> = this.orgStore.select(selectIsOrgSettingsSpinnerStarted);

  form: FormGroup;
  paymentTermsList: ISelectListItem<number>[] = paymentTermsList;
  imageUrl: string;
  textAreaLength = 200;
  orgSettings: OrganizationSettingsModel;
  taxModeList: ISelectListItem<string>[];

  get taxRegistered(): boolean {
    return this.lSService.getCurrentOrg().settings
      ? this.lSService.getCurrentOrg().settings.taxRegistered
      : true;
  }

  constructor(
    private fb: FormBuilder,
    private settingsStateService: SettingsStateService,
    private orgStore: Store<IOrganizationsState>,
    private settingsActionsService: SettingsActionsService,
    private lSService: LocalStorageService
  ) {
    this.settingsStateService.currentOrgSettings$.pipe(
      filter(res => Boolean(res)),
      takeUntil(this.subscription$)
    )
      .subscribe((orgSettings: OrganizationSettingsModel) => {
        this.orgSettings = orgSettings;
        this.imageUrl = orgSettings.logoSecureLink;
        this.fillForm();

        /** TODO: refactoring this method */
        this.form.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(() => {
          this.unsavedChanges = this.form.dirty;
        });
      });
    this.taxModeList = Object.values(taxModel);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  fillForm(): void {
    const paymentTerms = paymentTermsList.find(item => item.value === Number(this.orgSettings.invoicePaymentTerms));
    this.form = this.fb.group({
      paymentTerms: new FormControl(paymentTerms.value),
      address: new FormControl(this.orgSettings.invoiceAddress),
      invoiceFooter: new FormControl(this.orgSettings.invoiceFooter),
      groupChargesByDate: new FormControl(this.orgSettings.invoiceGroupChargesByDate || false),
      invoiceDefaultTaxMode: new FormControl(this.orgSettings.invoiceDefaultTaxMode)
    });
  }

  saveChanges(): void {
    const form = this.form.value;
    const editedOrganizationSettings: OrganizationSettingsModel = {
      id: this.orgSettings.id,
      yearEndDay: this.orgSettings.yearEndDay,
      yearEndMonth: this.orgSettings.yearEndMonth,
      taxNumber: this.orgSettings.taxNumber,
      taxRegistered: this.orgSettings.taxRegistered,
      taxRate: this.orgSettings.taxRate,
      invoiceDefaultTaxMode: form.invoiceDefaultTaxMode,
      invoiceFooter: form.invoiceFooter,
      invoiceAddress: form.address,
      invoiceTradingName: form.tradingName,
      invoicePaymentTerms: form.paymentTerms,
      orgId: this.orgSettings.orgId,
      orgName: this.orgSettings.orgName,
      invoiceGroupChargesByDate: form.groupChargesByDate,
      logoSecureLink: this.orgSettings.logoSecureLink
    };
    this.orgStore.dispatch(editOrganizationSettings({ orgSettings: editedOrganizationSettings }));
    this.unsavedChanges = false;
  }

  uploadFile(file: any): void {
    const formData = new FormData();
    formData.append(file.name, file);
    this.orgStore.dispatch(organizationsActions.uploadOrganizationLogo({ formData }));
  }

  canDeactivate(): Promise<boolean> {
    return this.settingsActionsService.openConfirmExitDialog();
  }
}
