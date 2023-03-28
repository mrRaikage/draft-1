import { Component, OnInit, OnDestroy, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { LedgerApiService } from '../../services/api/ledger-api.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';

import * as ledgersActions from '../../core/store/ledgers/ledgers.actions';
import * as ledgersSelectors from '../../core/store/ledgers/ledgers.selectors';
import * as accountsSelectors from '../../core/store/accounts/accounts.selectors';
import * as orgSelectors from '../../core/store/organizations/organizations.selectors';

import { ILedgerState } from '../../core/store/ledgers/ledgers.reducer';
import { IAccountsState } from '../../core/store/accounts/accounts.reducer';

import { EmptyContentModel } from '../../core/interfaces/empty-content.interface';
import { AccountModel, AccountTypeModel } from '../../core/interfaces/account.interface';
import { LedgerDataModel, LedgerItem, LedgerParamsModel } from '../../interfaces/ledger.interface';
import { ISelectListGroup } from '../../shared/interfaces/select-control.interface';

import { emptyContentLedgers } from '../../core/constants/empty-content.constant';
import { getAccountById } from '../../shared/utils/functions/get-account-by-id.function';
import { IOrganizationsState } from '../../core/store/organizations/organizations.reducer';

@Component({
  selector: 'app-ledgers',
  templateUrl: './ledgers.component.html',
  styleUrls: ['./ledgers.component.scss']
})
export class LedgersPageComponent implements OnInit, OnDestroy {
  destroy$: Subject<void> = new Subject<void>();

  formGroup: FormGroup;
  accountTypesList: ISelectListGroup<AccountModel[]>[];
  ledgersFormData: LedgerParamsModel;
  prevPageLink: string | null;
  nextPageLink: string | null;

  emptyContentLedgers: EmptyContentModel = emptyContentLedgers;
  subscription: Subscription = new Subscription();

  ledgers$: Observable<LedgerItem[]> = this.ledgerStore.select(ledgersSelectors.selectLedgersData).pipe(
    filter(res => !!res),
    withLatestFrom(this.accountsStore.select(accountsSelectors.selectAccountsData)),
    map(([ledgerData, accounts]: [LedgerDataModel, AccountModel[]]) => {
      this.prevPageLink = ledgerData.previousPage;
      this.nextPageLink = ledgerData.nextPage;
      return ledgerData.items
        .map(item => ({ ...item, account: getAccountById(accounts, item.accountId) }))
        .filter(item => item.account);
    }
    ),
  );
  dataLoaded$: Observable<boolean> = this.ledgerStore.select(ledgersSelectors.selectIsDataLoaded);
  accounts$: Observable<AccountModel[]> = this.accountsStore.select(accountsSelectors.selectAccountsData)
    .pipe(filter(res => !!res && !!res.length));
  accountTypes$: Observable<AccountTypeModel[]> = this.accountsStore.select(accountsSelectors.selectAccountTypes)
    .pipe(filter(res => !!res && !!res.length));
  spinner$ = this.ledgerStore.select(ledgersSelectors.selectApplySpinner);

  @ViewChildren('controlComponent') controlComponents;

  maxAccounts: boolean;
  warningText = 'Maximum (10) account selection reached';

  constructor(
    private fb: FormBuilder,
    private ledgerService: LedgerApiService,
    private lSService: LocalStorageService,
    private ledgerStore: Store<ILedgerState>,
    private orgStore: Store<IOrganizationsState>,
    private accountsStore: Store<IAccountsState>,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.ledgersFormData = this.lSService.getLedgersFilterData();
    if (this.ledgersFormData) {
      this.fillForm(this.ledgersFormData);
    }
    this.generateAccountsList();
    this.subscription.add(this.orgStore.select(orgSelectors.selectIsCurrentOrgChanged)
      .subscribe((orgChanged) => {
        if (orgChanged) {
          this.ledgerStore.dispatch(ledgersActions.clearLedgersData());
          this.initForm();
          this.resetControls();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    const today = new Date();
    const sixMonthAgo = new Date(new Date().setMonth(today.getMonth() - 6));
    this.formGroup = this.fb.group({
      MinDate: this.fb.control(sixMonthAgo, [Validators.required]),
      AccountIds: this.fb.control([], [Validators.required, Validators.maxLength(10)]),
      MaxDate: this.fb.control(today, [Validators.required]),
    });

    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.AccountIds.length > 10 && !this.maxAccounts) {
          this.maxAccounts = true;
        } else if (res.AccountIds.length <= 10 && this.maxAccounts) {
          this.maxAccounts = false;
        }
    });
  }

  fillForm(params: LedgerParamsModel): void {
    this.formGroup.patchValue(params);
  }

  resetControls(): void {
    this.controlComponents?._results?.forEach(comp => {
      if (comp.formControl) {
        comp.formControl.reset();
      }
    });
  }

  onApply(): void {
    const formGroupValue = this.formGroup.value;
    const params = {
      Term: null,
      MinDate: moment(formGroupValue.MinDate).format('YYYY-MM-DD'),
      AccountIds: formGroupValue.AccountIds,
      MaxDate: moment(formGroupValue.MaxDate).format('YYYY-MM-DD'),
      Page: '1',
      Limit: '50',
    } as LedgerParamsModel;
    this.ledgerStore.dispatch(ledgersActions.filterLedgersData({ params }));
    this.lSService.setLedgersFilterData(params);
    this.initForm();
    this.fillForm(this.lSService.getLedgersFilterData());
  }

  generateAccountsList(): void {
    this.subscription.add(combineLatest([this.accounts$, this.accountTypes$])
      .subscribe(([accounts, accountTypes]) => {
        if (accountTypes && accounts) {
          this.accountTypesList = accountTypes.map(type => ({
            displayName: type.name,
            children: accounts.filter(acc => acc.accountTypeId === type.id).map((data) => {
              return {
                ...data,
                selected: false
              };
            })
          }));
        }
    }));
  }

  onNextPage(): void {
    this.ledgerStore.dispatch(ledgersActions.filterLedgersData({ url: this.nextPageLink }));
  }

  onPrevPage(): void {
    this.ledgerStore.dispatch(ledgersActions.filterLedgersData({ url: this.prevPageLink }));
  }
}
