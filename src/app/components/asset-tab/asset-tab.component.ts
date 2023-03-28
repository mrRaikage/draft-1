import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatest, Subject } from 'rxjs';
import { filter, takeUntil, withLatestFrom } from 'rxjs/operators';

import { AccountModel } from '../../core/interfaces/account.interface';
import { IAccountsState } from '../../core/store/accounts/accounts.reducer';
import * as accountsSelectors from '../../core/store/accounts/accounts.selectors';
import { ISelectListItem } from '../../shared/interfaces/select-control.interface';
import { ModalModeService } from '../../shared/services/modal-mode.service';
import { getAccountById } from '../../shared/utils/functions/get-account-by-id.function';
import { ModalMode } from '../../core/constants/transaction.constants';
import * as assetSelectors from '../../core/store/asset/asset.selectors';
import * as assetActions from '../../core/store/asset/asset.actions';
import { DepreciationMethods, depreciationMethods } from '../../core/constants/asset.constants';
import { AssetModel } from '../../core/interfaces/asset.interface';
import { ModalAssetService } from '../../core/services/state/asset/modal-asset.service';
import { IAssetState } from '../../core/store/asset/asset.reducer';

@Component({
  selector: 'app-asset-tab',
  templateUrl: './asset-tab.component.html',
  styleUrls: ['./asset-tab.component.scss']
})
export class AssetTabComponent implements OnInit, OnDestroy {

  subscription$ = new Subject();
  form: FormGroup;
  currentAsset: AssetModel;
  accounts: AccountModel[];
  depreciationMethods = Object.values(depreciationMethods);
  isRegisterState: boolean;
  spinner$ = this.assetStore.select(assetSelectors.selectIsSpinnerStarted);

  get modalMode(): ModalMode | string {
    return this.modalModeService.getModalMode();
  }

  constructor(
    public dialogRef: MatDialogRef<AssetTabComponent>,
    private fb: FormBuilder,
    private modalModeService: ModalModeService,
    private modalAssetService: ModalAssetService,
    private assetStore: Store<IAssetState>,
    private accountsStore: Store<IAccountsState>
  ) {}

  ngOnInit(): void {

    combineLatest([
      this.modalAssetService.currentTransactionAsset$.pipe(takeUntil(this.subscription$)),
      this.accountsStore.select(accountsSelectors.selectAccountsData).pipe(takeUntil(this.subscription$))
    ])
      .subscribe(([currentAsset, accounts]: [AssetModel, AccountModel[]]) => {
        this.currentAsset = currentAsset;
        this.accounts = accounts;

        this.fillFormGroup(currentAsset);
      });
  }

  fillFormGroup(asset: AssetModel): void {
    this.form = this.fb.group({
      name: new FormControl(asset.name, [Validators.required]),
      details: new FormControl(null),
      depreciationMethod: new FormControl(
        this.getDepreciationMethod(asset.depreciationMethod),
        [Validators.required]
      ),
      depreciationRate: new FormControl(asset.depreciationRate, [Validators.required]),
      effectiveLife: new FormControl(asset.effectiveLife, [Validators.required]),
      residualValue: new FormControl(asset.residualValue, [Validators.required])
    });
  }

  getCategoryNameById(id: string): string {
    return getAccountById(this.accounts, id)?.name;
  }

  getDepreciationMethod(value): ISelectListItem<DepreciationMethods> {
    return this.depreciationMethods.find(item => item.value === value);
  }

  saveButtonClick(): void {
    if (this.form.invalid) {
      return;
    }

    const editAsset: AssetModel = this.getTouchedForm();
    this.assetStore.dispatch(assetActions.editAsset({
      data: editAsset
    }));

    this.assetStore.select(assetSelectors.selectIsDataLoadedAfterAction)
      .pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res)),
        withLatestFrom(this.assetStore.select(
          assetSelectors.selectCurrentAsset)
        )
      )
      .subscribe(([, asset]) => {
        this.modalAssetService.setCurrentTransactionAsset(asset);
        this.modalModeService.setModalMode(ModalMode.View);
      });

  }

  getTouchedForm(): AssetModel {
    const form = this.form.value;
    const asset = this.currentAsset;

    return {
      ...asset,
      name: form.name,
      status: this.isRegisterState || this.currentAsset.status === 'Registered' ? 'Registered' : 'DRAFT',
      depreciationMethod: form.depreciationMethod.value,
      effectiveLife: form.effectiveLife,
      depreciationRate: form.depreciationRate,
      residualValue: form.residualValue
    };
  }

  editButtonClick(): void {
    this.modalModeService.setModalMode(ModalMode.Edit);
  }

  cancelButtonClick(): void {
    if (this.modalMode !== ModalMode.Edit) {
      this.dialogRef.close();
    } else {
      this.resetCurrentModal();
      this.modalModeService.setModalMode(ModalMode.View);
    }

    this.isRegisterState = false;
  }

  resetCurrentModal(): void {
    this.currentAsset = this.modalAssetService.getCurrentTransactionAsset();
    this.fillFormGroup(this.currentAsset);
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

}
