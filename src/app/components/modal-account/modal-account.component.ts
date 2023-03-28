import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { taxModeList } from '../../core/constants/account.constant';

import * as accountsActions from '../../core/store/accounts/accounts.actions';
import * as accountsSelectors from '../../core/store/accounts/accounts.selectors';
import * as moment from 'moment';
import { ModalMode } from '../../core/constants/transaction.constants';
import { AccountModel, AccountTypeModel } from '../../core/interfaces/account.interface';
import { ISelectListGroup } from '../../shared/interfaces/select-control.interface';
import { IAccountsState } from '../../core/store/accounts/accounts.reducer';
import { ModalModeService } from '../../shared/services/modal-mode.service';
import { ModalAccountService } from '../../core/services/state/accounts/modal-account.service';
import { sortArrayByProperty } from '../../shared/utils/functions/helper.functions';
import { getAccountTypesGroups } from '../../shared/utils/functions/get-account-groups.function';
import { mapAddAccountModelToDto, mapEditAccountModelToDto } from '../../core/mappers/account.mapper';
import {
  ModalConfirmComponent
} from '../../shared/components/modal-confirm/modal-confirm.component';
import { ModalConfirmData, ModalConfirmType } from '../../shared/interfaces/modal-confirm.interface';

@Component({
  selector: 'app-modal-account',
  templateUrl: './modal-account.component.html',
  styleUrls: ['./modal-account.component.scss']
})
export class ModalAccountComponent implements OnInit, OnDestroy {

  subscription$ = new Subject();

  modalMode: ModalMode | string;
  currentAccount: AccountModel;
  accountTypes: AccountTypeModel[];
  groupedAccountTypes: ISelectListGroup<AccountTypeModel[]>[];
  form: FormGroup;
  hasOpeningBalance: boolean;
  selectedAccountType: AccountTypeModel;

  spinner$: Observable<boolean> = this.accountStore.select(accountsSelectors.selectIsSpinnerStarted);

  taxModeList = taxModeList;

  constructor(
    public dialogRef: MatDialogRef<ModalAccountComponent>,
    private fb: FormBuilder,
    private accountsStore: Store<IAccountsState>,
    private modalModeService: ModalModeService,
    private modalAccountService: ModalAccountService,
    private accountStore: Store<IAccountsState>,
    private dialog: MatDialog
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    /** Current Account Subscription */
    this.modalAccountService.currentAccount$
      .pipe(takeUntil(this.subscription$))
      .subscribe((account: AccountModel) => {
        this.currentAccount = account;
        this.hasOpeningBalance = account.hasOpeningBalance;
        this.fillForm(this.currentAccount);
      });

    /** Modal Mode Subscription */
    this.modalModeService.modalMode$
      .pipe(takeUntil(this.subscription$))
      .subscribe((modalMode: ModalMode) => this.modalMode = modalMode);

    /** Account Types Subscription */
    this.accountsStore.select(accountsSelectors.selectAccountTypes)
      .pipe(takeUntil(this.subscription$))
      .subscribe((accountTypes: AccountTypeModel[]) => {
        this.accountTypes = accountTypes;
        this.groupedAccountTypes = sortArrayByProperty(Object.values(getAccountTypesGroups(accountTypes)), 'displayName');
      });
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  fillForm(account: AccountModel): void {
    this.form = this.fb.group({
      name: new FormControl(account.name, [Validators.required]),
      accountType: new FormControl(account.accountType, [Validators.required]),
      code: new FormControl(account.code, this.setCodeValidator.bind(this)),
      description: new FormControl(account.description),
      isCash: new FormControl(account.isCash || false),
      taxMode: new FormControl(account.defaultTaxRate || 0, [Validators.required]),
      openingBalanceDate: new FormControl(
        this.hasOpeningBalance ? account.openingBalanceDate : null,
        this.setOpeningBalanceValidator.bind(this)
      ),
      openingBalanceAmount: new FormControl(
        this.hasOpeningBalance ? account.openingBalanceAmount : null,
        this.setOpeningBalanceValidator.bind(this)
      )
    });
  }

  setCodeValidator(control: AbstractControl): ValidationErrors | null {
    return this.modalMode !== ModalMode.Add
      ? Validators.required(control)
      : null;
  }

  setOpeningBalanceValidator(control: AbstractControl): ValidationErrors | null {
    return this.hasOpeningBalance ? Validators.required(control) : null;
  }

  touchAccountData(): AccountModel {
    const formData = this.form.value;
    return {
      ...this.currentAccount,
      name: formData.name,
      accountTypeId: formData.accountType.id,
      code: formData.code,
      description: formData.description,
      isCash: formData.isCash,
      defaultTaxRate: formData.taxMode,
      isSystem: false,
      openingBalanceDate: formData.openingBalanceDate ? moment(formData.openingBalanceDate).format('YYYY-MM-DD') : null,
      openingBalanceAmount: formData.openingBalanceAmount,
      hasOpeningBalance: this.hasOpeningBalance
    };
  }

  saveButtonClick(): void {
    const data: AccountModel = this.touchAccountData();

    if (this.modalMode === ModalMode.Add) {
      this.accountStore.dispatch(accountsActions.addAccount({ data: mapAddAccountModelToDto(data) }));
    }

    if (this.modalMode === ModalMode.Edit) {
      this.accountStore.dispatch(accountsActions.editAccount({ data: mapEditAccountModelToDto(data) }));
    }

    this.accountStore.select(accountsSelectors.selectIsAccountActionDataLoaded).pipe(
      takeUntil(this.subscription$),
      filter(result => Boolean(result)),
      withLatestFrom(this.accountStore.select(accountsSelectors.selectCurrentAccount))
    ).subscribe(([, account]: [any, AccountModel]) => {
      this.modalAccountService.setCurrentAccount({
        ...account,
        accountType: this.accountTypes.find((type: AccountTypeModel) => type.id === account.accountTypeId)
      });
      this.modalModeService.setModalMode(ModalMode.View);
    });
  }

  setOpeningBalance(state: boolean): void {
    this.hasOpeningBalance = state;
  }

  resetOpeningBalance(): void {
    const deleteDialog = this.dialog.open(ModalConfirmComponent, {
      height: '300px',
      width: '440px',
      autoFocus: false,
      data: {
        text: 'Are you sure you want to delete opening balance?',
        submitName: 'Delete',
        type: ModalConfirmType.DELETE,
        spinner$: this.accountStore.select(accountsSelectors.selectIsSpinnerStarted),
        action: () => {
          this.setOpeningBalance(false);
          this.form.get('openingBalanceDate').patchValue(null);
          this.form.get('openingBalanceAmount').patchValue(null);
          deleteDialog.close();
        }
      } as ModalConfirmData
    });
  }

  deleteButtonClick(): void {
    this.dialog.open(ModalConfirmComponent, {
      height: '300px',
      width: '440px',
      autoFocus: false,
      data: {
        text: 'Are you sure you want to delete this account?',
        submitName: 'Delete',
        type: ModalConfirmType.DELETE,
        spinner$: this.accountStore.select(accountsSelectors.selectIsDeleteSpinnerStarted),
        actionSuccess$: this.accountStore.select(accountsSelectors.selectIsAccountActionDataLoaded),
        action: () => this.accountStore.dispatch(accountsActions.deleteAccount({ id: this.currentAccount.id }))
      } as ModalConfirmData
    })
      .afterClosed()
      .pipe(take(1), filter(res => Boolean(res) && Boolean(this.dialogRef)))
      .subscribe(() => this.dialogRef.close());
  }

  editButtonClick(): void {
    this.modalModeService.setModalMode(ModalMode.Edit);
  }

  cancelButtonClick(): void {
    if (this.modalMode === ModalMode.Edit) {
      this.fillForm(this.currentAccount);
      this.modalModeService.setModalMode(ModalMode.View);
      this.setOpeningBalance(this.currentAccount.hasOpeningBalance);
    } else {
      this.dialogRef.close();
    }
  }

  setDefaultTaxRate(type): void {
    if (this.modalMode === 'Add' && type) {
      this.selectedAccountType = type;

      const taxMode = this.form.get('taxMode');
      if (type.parentType === 'Expense' || type.parentType === 'Revenue') {
        taxMode.setValue(0.15);
      }

      if (type.parentType === 'Equity' || type.parentType === 'Liability' || type.parentType === 'Assets') {
        taxMode.setValue(0);
      }
    }
  }
}
