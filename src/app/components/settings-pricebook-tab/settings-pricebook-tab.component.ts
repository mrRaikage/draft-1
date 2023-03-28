import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { PriceBookItemModel } from '../../core/interfaces/price-book.interface';
import { IPriceBookState } from '../../core/store/prce-book/price-book.reducer';
import * as priceBookSelectors from '../../core/store/prce-book/price-book.selectors';
import * as accountsSelectors from '../../core/store/accounts/accounts.selectors';
import { IAccountsState } from '../../core/store/accounts/accounts.reducer';
import { AccountModel } from '../../core/interfaces/account.interface';
import { ISelectListGroup } from '../../shared/interfaces/select-control.interface';
import { getAccountById } from '../../shared/utils/functions/get-account-by-id.function';
import * as priceBookActions from '../../core/store/prce-book/price-book.actions';
import { SettingsActionsService } from '../../core/services/state/settings/settings-actions.service';
import { emptyContentPriceBook } from '../../core/constants/empty-content.constant';
import { EmptyContentModel } from '../../core/interfaces/empty-content.interface';

@Component({
  selector: 'app-settings-pricebook-tab',
  templateUrl: './settings-pricebook-tab.component.html',
  styleUrls: ['./settings-pricebook-tab.component.scss']
})
export class SettingsPricebookTabComponent implements OnInit, OnDestroy {

  subscription$ = new Subject();
  tableFormGroupRows$ = new BehaviorSubject<FormGroup[]>(null);

  unsavedChanges = false;
  orgPriceBookItems: PriceBookItemModel[];
  accounts: AccountModel[];
  groupedAccounts: ISelectListGroup<AccountModel[]>[];
  columns: string[];
  formControl: FormControl = this.fb.control(null);
  linesIsValid: boolean;
  isFormDirty: boolean;
  priceBookIsLoading$: Observable<boolean> = this.priceBookStore.select(priceBookSelectors.selectDataIsLoading);
  spinner$: Observable<boolean> = this.priceBookStore.select(priceBookSelectors.selectSpinner);
  emptyContentPriceBook: EmptyContentModel = emptyContentPriceBook;

  constructor(
    private priceBookStore: Store<IPriceBookState>,
    private accountsStore: Store<IAccountsState>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private settingsActionsService: SettingsActionsService
  ) {
    /** Select Accounts */
    this.accountsStore.select(accountsSelectors.selectAccountsData)
      .pipe(filter(res => Boolean(res)), takeUntil(this.subscription$))
      .subscribe((accounts: AccountModel[]) => {
        this.accounts = accounts;
        this.groupedAccounts = [{
          displayName: 'Revenue',
          children: accounts.filter(item => item.accountType.parentType === 'Revenue')
        }];
      });

    /** Dispatch Organization Price Book */
    this.priceBookStore.dispatch(priceBookActions.orgPriceBook());

    /** Select Organization Price Book */
    this.priceBookStore.select(priceBookSelectors.selectOrgPriceBook)
      .pipe(filter(res => Boolean(res), takeUntil(this.subscription$)))
      .subscribe((orgPriceBookItems: PriceBookItemModel[]) => {
        this.orgPriceBookItems = orgPriceBookItems;
        this.setTableData();
      });
  }

  ngOnInit(): void {}

  setTableData(): void {
    this.tableFormGroupRows$.next(this.fillPriceBookGroups(this.orgPriceBookItems));
    this.columns = ['remove', 'editableStatus', 'unit', 'rate', 'revenueAccounts'];
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  fillPriceBookGroups(rows: PriceBookItemModel[]): FormGroup[] {
    return rows.map((row: PriceBookItemModel) => this.fb.group({
      editableStatus: new FormControl(row.status, [Validators.required]),
      unit: new FormControl(row.unit, [Validators.required]),
      rate: new FormControl(row.rate, [Validators.required]),
      revenueAccounts: new FormControl(row.accountId ? getAccountById(this.accounts, row.accountId) : null, [Validators.required]),
      id: new FormControl(row.id, [Validators.required])
    }));
  }

  setPriceBookLines(event: FormArray): void {
    this.formControl.patchValue(event.value);
    this.cdr.detectChanges();
  }

  isFormValid(): boolean {
    return this.linesIsValid;
  }

  setFormDirty(event: boolean): void {
    this.unsavedChanges = event;
    this.isFormDirty = event;
  }

  saveButtonClick(): void {
    if (!this.isFormValid()) {
      return;
    }

    /** Dispatch Edit Organization Price Book */
    this.priceBookStore.dispatch(priceBookActions.editOrgPriceBook({
        data: this.getTouchedPriceBookData(this.formControl.value)
      })
    );

    this.priceBookStore.select(priceBookSelectors.selectIsLoadAfterAction)
      .pipe(
        filter(res => Boolean(res)),
        withLatestFrom(this.priceBookStore.select(priceBookSelectors.selectOrgPriceBook)),
        take(1),
      )
      .subscribe(([, orgPriceBook]: [any, PriceBookItemModel[]]) => {
        this.fillPriceBookGroups(orgPriceBook);
        this.setFormDirty(false);
      });

  }

  getTouchedPriceBookData(priceBookData: any): PriceBookItemModel[] {
    return priceBookData.map(item => ({
      unit: item.unit,
      rate: item.rate,
      status: item.editableStatus,
      accountId: item.revenueAccounts ? item.revenueAccounts.id : null,
      id: item.id
    }));
  }

  canDeactivate(): Promise<boolean> {
    return this.settingsActionsService.openConfirmExitDialog();
  }
}
