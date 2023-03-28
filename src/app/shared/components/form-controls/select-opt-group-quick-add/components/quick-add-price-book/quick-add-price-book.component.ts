import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output, ViewChild
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { AccountModel, AddAccountDto } from '../../../../../../core/interfaces/account.interface';
import * as accountsActions from '../../../../../../core/store/accounts/accounts.actions';
import { IAccountsState } from '../../../../../../core/store/accounts/accounts.reducer';
import * as accountsSelectors from '../../../../../../core/store/accounts/accounts.selectors';
import { IClientsState } from '../../../../../../core/store/clients/clients.reducer';
import { PriceBookItemModel } from '../../../../../../core/interfaces/price-book.interface';
import * as priceBookSelectors from '../../../../../../core/store/prce-book/price-book.selectors';
import { IPriceBookState } from '../../../../../../core/store/prce-book/price-book.reducer';
import { ISelectListGroup } from '../../../../../interfaces/select-control.interface';
import { SelectOptGroupQuickAddComponent } from '../../select-opt-group-quick-add.component';

@Component({
  selector: 'app-quick-add-price-book',
  templateUrl: './quick-add-price-book.component.html',
  styleUrls: ['./quick-add-price-book.component.scss']
})
export class QuickAddPriceBookComponent implements OnInit, OnDestroy {

  @Input() groupName: string;
  @Input() groupChildren: PriceBookItemModel[];
  @Input() autoGroup: MatAutocomplete;
  @Input() groupIndex: number;

  @Input() set panelIsOpened(e) {
    this.resetState();
  }

  @Output() quickAddPriceBook = new EventEmitter<any>();

  @ViewChild('el') el: ElementRef;

  isAddState = false;
  form: FormGroup;
  groupedAccounts: ISelectListGroup<AccountModel[]>[];

  spinner$ = this.priceBookStore.select(priceBookSelectors.selectSpinner);
  subscription$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private accountsStore: Store<IAccountsState>,
    private clientsStore: Store<IClientsState>,
    private priceBookStore: Store<IPriceBookState>,
    private cdr: ChangeDetectorRef
  ) {

    this.accountsStore.select(accountsSelectors.selectAccountsData)
      .pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res))
      )
      .subscribe(accounts => {
        this.groupedAccounts = [{
          displayName: 'Revenue',
          children: accounts.filter(item => item.accountType.parentType === 'Revenue')
        }];
      });

    this.form = this.fb.group({
      unit: new FormControl(null, [Validators.required]),
      rate: new FormControl(null, [Validators.required]),
      account: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  setError(control: AbstractControl, isError): void {
    control.setErrors(isError ? { incorrect: true } : null);
  }

  quickAddButtonClick($event: Event): void {
    $event.stopPropagation();
    this.isAddState = true;
    this.cdr.detectChanges();
    this.scrollTo();
  }

  scrollTo(): void {
    let height = 0;
    for (let i = 0; i <= this.groupIndex; i++) {
      height += this.autoGroup.panel.nativeElement.children[i].offsetHeight;
    }
    this.autoGroup.panel.nativeElement.scrollTop = height - 161;
  }

  addButtonClick(): void {
    this.quickAddPriceBook.emit(this.form.getRawValue());
  }

  resetState(): void {
    this.isAddState = false;
    this.form.reset();
  }

  quickAddRevenueAccount(form: AddAccountDto, quickAddAccountComponent: SelectOptGroupQuickAddComponent): void {
    this.accountsStore.dispatch(accountsActions.addAccount({ data: form }));
    this.accountsStore.select(accountsSelectors.selectCurrentAccount)
      .pipe(filter(res => Boolean(res)), take(1))
      .subscribe((account: AccountModel) => {
        const expenseCategoryControl = this.form.get('account') as FormControl;
        expenseCategoryControl.setValue(account);
        quickAddAccountComponent.closePanel();
      });
  }
}

