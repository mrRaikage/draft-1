import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  EventEmitter
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { AddAccountDto } from '../../../../../../core/interfaces/account.interface';
import { IAccountsState } from '../../../../../../core/store/accounts/accounts.reducer';
import * as accountsSelectors from '../../../../../../core/store/accounts/accounts.selectors';
import { ISelectListGroup } from '../../../../../interfaces/select-control.interface';

@Component({
  selector: 'app-quick-add-account',
  templateUrl: './quick-add-account.component.html',
  styleUrls: ['./quick-add-account.component.scss']
})
export class QuickAddAccountComponent implements OnInit, OnDestroy {

  @Input() groupName: string;
  @Input() autoGroup: MatAutocomplete;
  @Input() groupIndex = 0;
  @Input() set panelIsOpened(e) {
    this.resetState();
  }

  @Output() quickAddAccount = new EventEmitter<AddAccountDto>();

  @ViewChild('el') el: ElementRef;

  isAddState = false;
  form: FormGroup;

  spinner$ = this.accountsStore.select(accountsSelectors.selectIsSpinnerStarted);
  subscription$ = new Subject();
  groupedAccountsTypes$ = this.accountsStore.select(accountsSelectors.selectAccountTypes)
    .pipe(
      takeUntil(this.subscription$),
      filter(res => Boolean(res)),
      map(types => {
        const group = types.filter(type => type.parentType === this.groupName);
        return [{ displayName: this.groupName, children: group }];
      })
    );

  taxModeList: ISelectListGroup<any>[] = [] = [
    {
      displayName: 'Rate',
      children: [
        {
          value: 0.15,
          name: '15%'
        },
        {
          value: 0,
          name: 'No Tax'
        }
      ]
    }
  ];

  constructor(
    private fb: FormBuilder,
    private accountsStore: Store<IAccountsState>,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: new FormControl(null, [Validators.required]),
      taxMode: new FormControl(null, [Validators.required]),
      account: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  setDefaultTaxRate(type): void {
    if (!type) {
      return;
    }

    const taxMode = this.form.get('taxMode');
    if (type.parentType === 'Expense' || type.parentType === 'Revenue') {
      taxMode.setValue({
        value: 0.15,
        name: '15%'
      });
    }

    if (type.parentType === 'Equity' || type.parentType === 'Liability' || type.parentType === 'Assets') {
      taxMode.setValue({
        value: 0,
        name: 'No Tax'
      });
    }
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
    this.autoGroup.panel.nativeElement.scrollTop = height - 350;
  }

  addButtonClick(): void {
    const form = this.form.value;
    const data = {
      name: form.name,
      accountTypeId: form.account.id,
      defaultTaxRate: form.taxMode.value
    };
    this.quickAddAccount.emit(data);
  }

  resetState(): void {
    this.isAddState = false;
    this.form.reset();
  }
}
