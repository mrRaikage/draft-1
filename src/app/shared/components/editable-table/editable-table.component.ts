import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import * as moment from 'moment';

import * as accountsActions from '../../../core/store/accounts/accounts.actions';
import * as accountsSelectors from '../../../core/store/accounts/accounts.selectors';
import { IAccountsState } from '../../../core/store/accounts/accounts.reducer';
import { ClientModel } from '../../../core/interfaces/clients.interface';
import { IClientsState } from '../../../core/store/clients/clients.reducer';
import * as clientsSelectors from '../../../core/store/clients/clients.selectors';
import * as priceBookActions from '../../../core/store/prce-book/price-book.actions';
import { IPriceBookState } from '../../../core/store/prce-book/price-book.reducer';
import * as selectPriceBook from '../../../core/store/prce-book/price-book.selectors';
import { ISelectListGroup, ISelectListItem } from '../../interfaces/select-control.interface';
import { AccountModel, AccountTypeModel, AddAccountDto } from '../../../core/interfaces/account.interface';
import { ModalMode, TaxMode } from '../../../core/constants/transaction.constants';
import { getAccountById } from '../../utils/functions/get-account-by-id.function';
import { PriceBookItemModel } from '../../../core/interfaces/price-book.interface';
import { SelectOptGroupQuickAddComponent } from '../form-controls/select-opt-group-quick-add/select-opt-group-quick-add.component';
import { EmptyContentModel } from '../../../core/interfaces/empty-content.interface';

@Component({
  selector: 'app-editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.scss']
})

export class EditableTableComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() class: string;

  @Input() columns: string[];
  @Input() requiredColumns: string[] = [];
  @Input() accounts: AccountModel[];
  @Input() groupedAccounts: ISelectListGroup<AccountModel[]>[];
  @Input() groupedPriceBookItems: ISelectListGroup<PriceBookItemModel[]>[];
  @Input() groupedAccountTypes: ISelectListGroup<AccountTypeModel[]>[];

  @Input() disableUnitsField: boolean;
  @Input() formGroupRows$: Observable<FormGroup[]> = of(null);
  @Input() isLoading: boolean;
  @Input() taxMode: TaxMode;
  @Input() taxRegistered: boolean;
  @Input() tableContainerStyle: any;
  @Input() modalType: ModalMode;
  @Input() tableClass: string;

  @Input() emptyContentData: EmptyContentModel;
  @Input() hiddenRowData: EmptyContentModel;
  @Input() skeletonColumnsCount: number;
  @Input() skeletonRowCount = 6;
  @Input() rowsIsClickable: boolean;
  @Input() hasEmptyPageComponent: boolean;

  @Input() ledgerDate: string;
  @Input() showHidden$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  @Input() hiddenRowsParam: { key: string; value: string };

  @Output() handleRowClick = new EventEmitter<FormGroup>();
  @Output() changedLines = new EventEmitter<FormArray>();
  @Output() addLine = new EventEmitter<FormArray>();
  @Output() linesIsValid = new EventEmitter<boolean>();
  @Output() isDirty = new EventEmitter<boolean>(false);
  @Output() viewHiddenItemsClick = new EventEmitter();

  subscription$ = new Subject();

  dataSource = new MatTableDataSource();
  form: FormGroup = this.fb.group({ rows: this.fb.array([]) });
  rowHasErrors = false;
  showAddLineButton: boolean;
  onlyHidden: boolean;

  taxRateList: ISelectListItem<any>[] = [] = [
    {
      value: 0.15,
      displayName: '15%'
    },
    {
      value: 0,
      displayName: 'Tax Exempt'
    }
  ];
  selectStatusList: ISelectListItem<string>[] = [
    {
      displayName: 'Active',
      value: 'Active'
    },
    {
      displayName: 'Inactive',
      value: 'Inactive'
    }
  ];

  selection = new SelectionModel<any>(true, []);

  get formArrayRows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private accountsStore: Store<IAccountsState>,
    private clientsStore: Store<IClientsState>,
    private priceBookStore: Store<IPriceBookState>
  ) {
    this.formArrayRows.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(() => {
      if (this.formArrayRows.valid) {
        this.changedLines.emit(this.formArrayRows);
      }
      this.linesIsValid.emit(this.formArrayRows.valid && !this.rowHasErrors);
    });
  }

  ngOnInit(): void {
    this.showAddLineButton = !!this.addLine.observers.length;
  }

  ngAfterViewInit(): void {
    combineLatest([
      this.formGroupRows$.pipe(takeUntil(this.subscription$), filter(rows => Boolean(rows))),
      this.showHidden$.pipe(takeUntil(this.subscription$))
    ]).subscribe(([rows, showHidden]: [FormGroup[], boolean]) => {
      this.resetTable();
      this.onlyHidden = false;

      const hiddenKey = this.hiddenRowsParam?.key;
      const hiddenValue = this.hiddenRowsParam?.value;

      if (!showHidden) {
        const filtered = rows.filter(row => row.value[hiddenKey] !== hiddenValue);
        this.onlyHidden = !filtered.length && !!rows.length;
        rows = filtered;
      }

      rows.map((row: FormGroup) => this.addLineToFormArray(row));
      this.dataSource.data = this.formArrayRows.controls;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.filter((item: FormGroup) => item.value.status !== 'Invoiced').length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data.filter((item: FormGroup) => item.value.status !== 'Invoiced'));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  addLedgerRow(): void {
    const row = this.fb.group({
      date: new FormControl(null, [Validators.required]),
      account: new FormControl(null, [Validators.required]),
      debit: new FormControl(0, [Validators.required]),
      credit: new FormControl(0, [Validators.required])
    });
    this.addLineToFormArray(row);
    this.dataSource.data = this.formArrayRows.controls;
  }

  addPriceBookRow(): void {
    const row = this.fb.group({
      editableStatus: new FormControl('Active', [Validators.required]),
      unit: new FormControl(null, [Validators.required]),
      rate: new FormControl(null, [Validators.required]),
      revenueAccounts: new FormControl(null, [Validators.required])
    });
    this.addLineToFormArray(row);
    this.dataSource.data = this.formArrayRows.controls;
  }

  addTransactionLineRow(): void {
    const row = this.fb.group({
      description: new FormControl(null),
      account: new FormControl(null, [Validators.required]),
      taxRate: new FormControl({ value: null, disabled: this.taxMode === 'NoTax' }, [Validators.required]),
      amount: new FormControl(null, [Validators.required])
    });
    this.addLineToFormArray(row);
    this.dataSource.data = this.formArrayRows.controls;
  }

  addLedgerLineRow(): void {
    const row = this.fb.group({
      account: new FormControl(null, [Validators.required]),
      debit: new FormControl(0, [Validators.required]),
      credit: new FormControl(0, [Validators.required])
    });
    this.addLineToFormArray(row);
    this.dataSource.data = this.formArrayRows.controls;
  }

  addInvoiceLineRow(): void {
    if (this.taxRegistered) {
      const row = this.fb.group({
        description: new FormControl(null),
        unitsString: new FormControl(null, [Validators.required]),
        revenueAccounts: new FormControl(null, [Validators.required]),
        quantity: new FormControl(null, [Validators.required]),
        rate: new FormControl(null, [Validators.required]),
        taxRate: new FormControl({ value: null, disabled: this.taxMode === 'NoTax' }, [Validators.required])
      });
      this.addLineToFormArray(row);
    } else {
      const row = this.fb.group({
        description: new FormControl(null),
        unitsString: new FormControl(null, [Validators.required]),
        revenueAccounts: new FormControl(null, [Validators.required]),
        quantity: new FormControl(null, [Validators.required]),
        rate: new FormControl(null, [Validators.required])
      });
      this.addLineToFormArray(row);
    }

    this.dataSource.data = this.formArrayRows.controls;
  }

  addBillLineRow(): void {
    if (this.taxRegistered) {
      const row = this.fb.group({
        description: new FormControl(null),
        account: new FormControl(null, [Validators.required]),
        taxRate: new FormControl({ value: null, disabled: this.taxMode === 'NoTax' }, [Validators.required]),
        amount: new FormControl(null, [Validators.required])
      });
      this.addLineToFormArray(row);
    } else {
      const row = this.fb.group({
        description: new FormControl(null),
        account: new FormControl(null, [Validators.required]),
        amount: new FormControl(null, [Validators.required])
      });
      this.addLineToFormArray(row);
    }

    this.dataSource.data = this.formArrayRows.controls;
  }

  addChargeLineRow(): void {
    const row = this.fb.group({
      status: new FormControl('Pending'),
      date: new FormControl(moment().format('YYYY-MM-DD'), [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      unitsString: new FormControl(null, [Validators.required]),
      rate: new FormControl(null, [Validators.required]),
      quantity: new FormControl(null, [Validators.required])
    });
    this.addLineToFormArray(row);
    this.dataSource.data = this.formArrayRows.controls;
  }

  addExpenseLineRow(): void {
    const row = this.fb.group({
      description: new FormControl(null),
      expenseCategory: new FormControl(null, [Validators.required]),
      taxRate: new FormControl({ value: null, disabled: this.taxMode === 'NoTax' }, [Validators.required]),
      amount: new FormControl(null, [Validators.required]),
      id: new FormControl(null)
    });
    this.addLineToFormArray(row);
    this.dataSource.data = this.formArrayRows.controls;
  }

  removeRow(index): void {
    this.formArrayRows.removeAt(index);
    this.dataSource.data = this.formArrayRows.controls;
  }

  addLineToFormArray(row: FormGroup): void {
    this.formArrayRows.push(row);
  }

  disable(isDisabled: boolean): void {
    isDisabled
      ? this.formArrayRows.disable()
      : this.formArrayRows.enable();
  }

  resetTable(): void {
    this.formArrayRows.clear();
    this.dataSource.data = this.formArrayRows.controls;
  }

  checkIsTableDirty(isDirty: boolean): void {
    if (isDirty) {
      this.isDirty.emit(isDirty);
    }
  }

  setError(index: number, name: string, isError: boolean): void {
    const control: FormControl = this.formArrayRows.get(index.toString()).get(name) as FormControl;
    control.setErrors(isError ? { incorrect: true } : null);
    this.rowHasErrors = isError;
    this.linesIsValid.emit(this.formArrayRows.valid && !this.rowHasErrors);
  }

  getInvoiceAmount(index): number {
    const formGroup: FormGroup = this.formArrayRows.get(index.toString()) as FormGroup;
    if (formGroup) {
      const quantity: number = Number(formGroup.get('quantity').value);
      const rate: number = Number(formGroup.get('rate').value);
      return quantity * rate;
    } else {
      return 0;
    }
  }

  unitsStringChanged(event: PriceBookItemModel, index): void {
    const formGroup = this.formArrayRows.controls[index] as FormGroup;
    const rateControl = formGroup?.get('rate') as FormControl;
    const accountControl = formGroup?.get('revenueAccounts') as FormControl;

    if (event && typeof event === 'object') {
      if (rateControl) {
        rateControl.patchValue(event.rate);
      }
      if (accountControl) {
        accountControl.patchValue(getAccountById(this.accounts, event.accountId));
      }
    }
  }

  getAsterix(columnName: string): string {
    return this.modalType !== 'View' && this.requiredColumns.indexOf(columnName) !== -1 ? '*' : null;
  }

  quickAddAccount(form: AddAccountDto, index: number, quickAddAccountComponent: SelectOptGroupQuickAddComponent, fieldName: string): void {
    this.accountsStore.dispatch(accountsActions.addAccount({ data: form }));
    this.accountsStore.select(accountsSelectors.selectCurrentAccount)
      .pipe(filter(res => Boolean(res)), take(1))
      .subscribe((account: AccountModel) => {
        const formGroup = this.formArrayRows.controls[index] as FormGroup;
        const expenseCategoryControl = formGroup?.get(fieldName) as FormControl;
        expenseCategoryControl.setValue(account);
        quickAddAccountComponent.closePanel();
      });
  }

  quickAddPriceBook(form, index, groupName, quickAddPriceBookComp: SelectOptGroupQuickAddComponent): void {

    const isClientPriceBook = groupName.toLowerCase().includes('client');

    const data = {
      unit: form.unit,
      rate: form.rate,
      accountId: form.account.id
    };

    if (isClientPriceBook) {
      this.clientsStore.select(clientsSelectors.selectClient)
        .pipe(take(1), filter(res => Boolean(res)))
        .subscribe((client: ClientModel) => {
          this.priceBookStore.dispatch(priceBookActions.addClientPriceBook({
            data: {
              ...data,
              clientId: client.id,
              status: 'Active'
            },
            clientId: client.id
          }));
        });
    } else {
      this.priceBookStore.dispatch(priceBookActions.addOrgPriceBook({
        data: {
          ...data,
          clientId: null,
          status: 'Active'
        }
      }));
    }

    this.priceBookStore.select(selectPriceBook.selectQuickAddPriceBook)
      .pipe(filter(res => Boolean(res)), take(1))
      .subscribe((unit: PriceBookItemModel) => {
        const addedUnit: PriceBookItemModel = { ...unit, name: unit.unit };
        const formGroup = this.formArrayRows.controls[index] as FormGroup;
        const unitsControl = formGroup?.get('unitsString') as FormControl;
        unitsControl.patchValue(addedUnit);
        quickAddPriceBookComp.closePanel();
      });

  }

  handleAccountChanged(index): void {
    const rowFormGroup = this.formArrayRows.controls[index] as FormGroup;
    const taxRateControl = rowFormGroup?.get('taxRate') as FormControl;
    const accountControl = rowFormGroup?.get('account') as FormControl;
    const expenseControl = rowFormGroup?.get('expenseCategory') as FormControl;
    const revenueAccountControl = rowFormGroup?.get('revenueAccounts') as FormControl;

    if (revenueAccountControl) {
      revenueAccountControl.valueChanges.pipe(take(1))
        .subscribe(acc => {
          taxRateControl.setValue(acc?.defaultTaxRate ? acc?.defaultTaxRate : 0);
        });
    }

    if (expenseControl) {
      expenseControl.valueChanges.pipe(take(1))
        .subscribe(acc => {
          taxRateControl.setValue(acc?.defaultTaxRate ? acc?.defaultTaxRate : 0);
        });
    }

    if (accountControl) {
      accountControl.valueChanges.pipe(take(1))
        .subscribe(acc => {
          taxRateControl.setValue(acc?.defaultTaxRate ? acc?.defaultTaxRate : 0);
        });
    }
  }
}
