import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { tableColumnsData } from '../../core/constants/account-table.settings';
import { IAccountsState } from '../../core/store/accounts/accounts.reducer';
import { IOrganizationsState } from '../../core/store/organizations/organizations.reducer';
import { selectAccountsData, selectIsDataLoaded } from '../../core/store/accounts/accounts.selectors';
import { AccountModel } from '../../core/interfaces/account.interface';
import { Action, ActionKey } from '../../shared/interfaces/actions.interface';
import { actionsList } from '../../shared/constants/actions.constants';
import { getAccountGroups } from '../../shared/utils/functions/get-account-groups.function';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { AccountActionsService } from '../../core/services/state/accounts/account-actions.service';
import { ISelectListGroup } from '../../shared/interfaces/select-control.interface';

@Component({
  selector: 'app-accounts-tab',
  templateUrl: './accounts-tab.component.html',
  styleUrls: ['./accounts-tab.component.scss']
})
export class AccountsTabComponent implements OnInit, OnDestroy {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  columnsData: { [key: string]: string } = tableColumnsData;
  accountGroups: { [key: string]: ISelectListGroup<AccountModel[]> };
  accountGroupList: string[];
  actions: Action[] = actionsList.filter((action: Action) => action.key !== ActionKey.View);
  dataLoaded$ = this.accountsStore.select(selectIsDataLoaded);
  skeletonItems = Array(8).fill(null);
  panelOpenState = false;

  subscription: Subscription = new Subscription();

  constructor(
    private accountsStore: Store<IAccountsState>,
    private organizationsStore: Store<IOrganizationsState>,
    private lSService: LocalStorageService,
    private accountActionService: AccountActionsService
  ) {
   this.subscription.add(this.accountsStore.select(selectAccountsData)
     .pipe(filter((res: AccountModel[]) => Boolean(res)))
     .subscribe((data: AccountModel[]) => {
       this.accountGroups = getAccountGroups(data);
       this.accountGroupList = Object.keys(this.accountGroups).sort();
     }));
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addChartOfAccount(): void {
    this.accountActionService.addAccount();
  }
}
