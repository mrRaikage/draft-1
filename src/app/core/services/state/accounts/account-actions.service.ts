import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { AccountModel, AccountTypeModel } from '../../../interfaces/account.interface';
import { ModalAccountComponent } from '../../../../components/modal-account/modal-account.component';
import { emptyAccount } from '../../../constants/account.constant';
import { ModalConfirmComponent } from '../../../../shared/components/modal-confirm/modal-confirm.component';
import { ModalConfirmData, ModalConfirmType } from '../../../../shared/interfaces/modal-confirm.interface';
import { IAccountsState } from '../../../store/accounts/accounts.reducer';
import { selectIsAccountActionDataLoaded, selectIsSpinnerStarted } from '../../../store/accounts/accounts.selectors';
import { deleteAccount } from '../../../store/accounts/accounts.actions';
import { ModalModeService } from '../../../../shared/services/modal-mode.service';
import { ModalMode } from '../../../constants/transaction.constants';
import { ModalAccountService } from './modal-account.service';

@Injectable({
  providedIn: 'root'
})
export class AccountActionsService {

  constructor(
    private dialog: MatDialog,
    private accountStore: Store<IAccountsState>,
    private modalModeService: ModalModeService,
    private modalAccountService: ModalAccountService
  ) { }

  addAccount(): void {
    this.modalModeService.setModalMode(ModalMode.Add);
    this.modalAccountService.setCurrentAccount(emptyAccount);
    this.openAccountModal();
  }

  editAccount(account: AccountModel): void {
    this.modalModeService.setModalMode(ModalMode.Edit);
    this.modalAccountService.setCurrentAccount(account);
    this.openAccountModal();
  }

  viewAccount(account: AccountModel): void {
    this.modalModeService.setModalMode(ModalMode.View);
    this.modalAccountService.setCurrentAccount(account);
    this.openAccountModal();
  }

  deleteAccount(id: string): void {
    this.dialog.open(ModalConfirmComponent, {
      height: '300px',
      width: '440px',
      autoFocus: false,
      data: {
        text: 'Are you sure you want to delete this account?',
        submitName: 'Delete',
        type: ModalConfirmType.DELETE,
        spinner$: this.accountStore.select(selectIsSpinnerStarted),
        actionSuccess$: this.accountStore.select(selectIsAccountActionDataLoaded),
        action: () => this.accountStore.dispatch(deleteAccount({ id })),
      } as ModalConfirmData
    });
  }

  openAccountModal(): void {
    this.dialog.open(ModalAccountComponent, {
      height: 'auto',
      width: '485px'
    });
  }

  touchAccounts(accounts: AccountModel[], accountTypes: AccountTypeModel[]): AccountModel[] {
    return accounts.map((account: AccountModel) => ({
      ...account,
      accountType: this.getAccountTypeById(account.accountTypeId, accountTypes)
    }));
  }

  getAccountTypeById(typeId: string, accountTypes: AccountTypeModel[]): AccountTypeModel {
    return accountTypes.find((accountType: AccountTypeModel) => accountType.id === typeId);
  }
}
