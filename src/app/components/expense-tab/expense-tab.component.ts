import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil, withLatestFrom } from 'rxjs/operators';

import { emptyAccount } from '../../core/constants/account.constant';
import { IAccountsState } from '../../core/store/accounts/accounts.reducer';
import { ModalInvoiceComponent } from '../modal-invoice/modal-invoice.component';
import { IOrganizationsState } from '../../core/store/organizations/organizations.reducer';
import { BaseControlValueAccessor } from '../../shared/components/form-controls/base-control-value-accessor';
import { AccountModel, AccountTypeModel } from '../../core/interfaces/account.interface';
import * as accountsActions from '../../core/store/accounts/accounts.actions';
import * as accountsSelectors from '../../core/store/accounts/accounts.selectors';
import { getAccountTypesGroups } from '../../shared/utils/functions/get-account-groups.function';
import { sortArrayByProperty } from '../../shared/utils/functions/helper.functions';
import { ISelectListGroup, ISelectListItem } from '../../shared/interfaces/select-control.interface';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { ModalModeService } from '../../shared/services/modal-mode.service';
import { getAccountById } from '../../shared/utils/functions/get-account-by-id.function';
import { touchTransaction } from '../../shared/utils/functions/touch-transaction.function';
import {
  emptyTransactionLine,
  ModalMode,
  TaxMode,
  taxModel,
  TransactionType
} from '../../core/constants/transaction.constants';
import {
  AddTransactionLineDto,
  AddTrxExpenseDto,
  EditTransactionLineDto,
  EditTrxExpenseDto,
  ExpenseModel,
  PaidFromTypes,
  TransactionLineModel,
  TransactionModel
} from '../../core/interfaces/transaction.interface';
import { ModalTransactionService } from '../../core/services/state/transactions/modal-transaction.service';
import { TransactionActionService } from '../../core/services/state/transactions/transaction-action.service';
import * as transactionsActions from '../../core/store/transactions/transactions.actions';
import { ITransactionsState } from '../../core/store/transactions/transactions.reducer';
import * as transactionsSelectors from '../../core/store/transactions/transactions.selectors';

@Component({
  selector: 'app-expense-tab',
  templateUrl: './expense-tab.component.html',
  styleUrls: ['./expense-tab.component.scss']
})
export class ExpenseTabComponent implements OnInit, OnDestroy {

  @Input() accounts: AccountModel[];

  @Output() closeModal = new EventEmitter<any>();

  spinner$ = this.transactionStore.select(transactionsSelectors.selectIsSpinnerStarted);
  subscription$ = new Subject();
  isDeleting$ = new BehaviorSubject<boolean>(false);
  tableFormGroupRows$ = new BehaviorSubject<FormGroup[]>(null);

  groupedExpenseAccounts: ISelectListGroup<AccountModel[]>[];
  groupedExpenseTypes: ISelectListGroup<AccountTypeModel[]>[];
  cashAccounts: ISelectListGroup<AccountModel[]>[];
  equityAccounts: ISelectListGroup<AccountModel[]>[];
  personalAccount: AccountModel = { ...emptyAccount, name: 'Personal Account' };
  taxModeList: ISelectListItem<string>[];
  currentExpense: TransactionModel;

  get modalMode(): ModalMode | string {
    return this.modalModeService.getModalMode();
  }

  form: FormGroup;
  subtotal = 0;
  tax = 0;
  total = 0;
  gst = 3 / 23;

  @ViewChildren('formField') inputs: QueryList<BaseControlValueAccessor<any>>;

  linesIsTouched: boolean;
  editableTableIsValid: boolean;
  tableColumns: string[];
  requiredColumns: string[];
  warningText = `<div>Warning. The Ledger entries for these transactions have been edited.</div>
                 <div>Saving changes to these transaction lines will reset the ledger.</div>`;

  constructor(
    private fb: FormBuilder,
    private accountsStore: Store<IAccountsState>,
    private organizationsStore: Store<IOrganizationsState>,
    private lSService: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private transactionStore: Store<ITransactionsState>,
    private transactionService: TransactionActionService,
    private dialogRef: MatDialogRef<ModalInvoiceComponent>,
    public modalTransactionService: ModalTransactionService,
    public modalModeService: ModalModeService
  ) { }

  ngOnInit(): void {
    this.groupedExpenseAccounts = this.getGroupedExpenseAccounts();
    this.cashAccounts = this.getGroupedCashAccounts();
    this.equityAccounts = this.getEquityAccounts();
    this.taxModeList = Object.values(taxModel);

    this.modalTransactionService.currentTransaction$
      .pipe(takeUntil(this.subscription$))
      .subscribe((value: TransactionModel) => {
        this.currentExpense = value;
        this.fillFormGroup(this.currentExpense);
        this.setTableData();
      });

    /** Update Accounts List After Quick Add */
    this.accountsStore.select(accountsSelectors.selectIsAccountActionDataLoaded)
      .pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res)),
        withLatestFrom(this.accountsStore.select(accountsSelectors.selectAccountsData))
      )
      .subscribe(([, accounts]) => {
        this.accounts = accounts;
        this.groupedExpenseAccounts = this.getGroupedExpenseAccounts();
        this.cdr.detectChanges();
      });

    this.accountsStore.select(accountsSelectors.selectAccountTypes)
      .pipe(takeUntil(this.subscription$))
      .subscribe((accountTypes: AccountTypeModel[]) => {
        const expenseAccount = accountTypes.filter(account => account.parentType === 'Expense');
        this.groupedExpenseTypes = sortArrayByProperty(Object.values(getAccountTypesGroups(expenseAccount)), 'displayName');
      });

    this.form.get('taxMode').valueChanges.pipe(takeUntil(this.subscription$)).subscribe((taxMode) => {
      const lines = this.form.get('lines').value;
      this.calculateAmountFields(lines, taxMode);
    });
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  setTableData(): void {
    this.tableFormGroupRows$.next(this.fillLinesGroups(
      this.modalMode === ModalMode.Add
        ? [emptyTransactionLine]
        : this.currentExpense.lines
    ));
    this.tableColumns = ['remove', 'description', 'expenseCategory', 'taxRate', 'amount'];
    this.requiredColumns = ['expenseCategory', 'taxRate', 'amount'];
  }

  getGroupedExpenseAccounts(): ISelectListGroup<AccountModel[]>[] {
    const expenseAccounts = this.accounts.filter(account => account.accountType.parentType === 'Expense');
    return [{ displayName: 'Expense', children: expenseAccounts }];
  }

  fillLinesGroups(rows: TransactionLineModel[]): FormGroup[] {
    return rows.map((row: TransactionLineModel) => this.fb.group({
      description: new FormControl(row.description),
      expenseCategory: new FormControl(row.account, [Validators.required]),
      taxRate: new FormControl(row.taxRate, [Validators.required]),
      amount: new FormControl(row.amount, [Validators.required]),
      id: new FormControl(row.id)
    }));
  }

  fillFormGroup(trxExpense: TransactionModel): void {
    const paidFrom = trxExpense.expense?.paidFromAccountId
      ? getAccountById(this.accounts, trxExpense.expense.paidFromAccountId)
      : null;

    /** Fill Form Group */
    this.form = this.fb.group({
      supplier: new FormControl(trxExpense.party, [Validators.required]),
      paidFrom: new FormControl(
        !paidFrom && this.modalMode !== ModalMode.Add ? this.personalAccount : paidFrom,
        [Validators.required]
      ),
      needsReimbursed: new FormControl(!!trxExpense.expense?.needsReimbursed),
      reimburseString: new FormControl(trxExpense.expense ? trxExpense.expense.whoPaidString : null),
      reimburseAccount: new FormControl(trxExpense.expense ? getAccountById(this.accounts, trxExpense.expense.whoPaidAccountId) : null),
      date: new FormControl(trxExpense.date || moment(), [Validators.required]),
      dueDate: new FormControl(trxExpense.expense?.dueDate),
      ref: new FormControl(trxExpense.ref),
      taxMode: new FormControl(trxExpense.taxMode || TaxMode.Inclusive, [Validators.required]),
      lines: new FormControl(trxExpense.lines, [Validators.required])
    });
  }

  getGroupedCashAccounts(): ISelectListGroup<AccountModel[]>[] {
    const cashAccounts = this.accounts.filter((account: AccountModel) => Boolean(account.isCash));
    return [
      { displayName: 'Business Accounts', children: cashAccounts },
      { displayName: 'Other', children: [this.personalAccount] }
    ];
  }

  getEquityAccounts(): ISelectListGroup<AccountModel[]>[] {
    const equityAccounts = this.accounts.filter((account: AccountModel) => account.accountType.parentType === 'Equity');
    return [{ displayName: 'Equity Accounts', children: equityAccounts }];
  }

  calculateAmountFields(lines, taxMode): void {

    let total = 0;
    let tax = 0;
    lines.forEach((line) => {
      const lineAmount = Number(line.amount);
      total += lineAmount;

      if (taxMode === TaxMode.Inclusive && line.taxRate) {
        tax += lineAmount * this.gst;
      }

      if (taxMode === TaxMode.Exclusive) {
        tax += lineAmount * line.taxRate;
      }
    });

    this.subtotal = Number(total.toFixed(2));
    this.tax = Number(tax.toFixed(2));
    this.total = Number((taxMode === TaxMode.Exclusive ? (total + tax) : total).toFixed(2));
  }

  getCurrentTaxMode(): TaxMode {
    return this.form.get('taxMode').value;
  }

  setTransactionLines(event: FormArray): void {
    this.form.get('lines').patchValue(event.value);

    const taxMode = this.getCurrentTaxMode();
    this.calculateAmountFields(event.value, taxMode);

    this.cdr.detectChanges();
  }

  cancelButtonClick(): void {
    if (this.modalMode === 'View' || this.modalMode === 'Add') {
      this.closeModal.emit();
    }

    if (this.modalMode === 'Edit') {
      this.resetCurrentModal();
      this.modalModeService.setModalMode(ModalMode.View);
    }

  }

  resetCurrentModal(): void {
    this.fillFormGroup(this.currentExpense);
    this.setTableData();
  }

  deleteButtonClick(): void {
    this.isDeleting$.next(true);
    this.transactionService.deleteTransaction(this.currentExpense.id, 'transaction', this.dialogRef);
  }

  saveButtonClick(): void {
    if (!this.isFormValid()) {
      return;
    }

    /** Add New Expense */
    if (this.modalMode === ModalMode.Add) {
      const addTrxExpenseData: AddTrxExpenseDto = this.getAddTrxExpenseData(this.form.value);
      this.transactionStore.dispatch(transactionsActions.addTransaction({
        transaction: addTrxExpenseData
      }));
    }

    /** Edit Expense */
    if (this.modalMode === ModalMode.Edit) {
      const editTrxExpenseData: EditTrxExpenseDto = this.getTrxExpenseDataTypeEdit(this.form.value);
      this.transactionStore.dispatch(transactionsActions.editTransaction({
        data: editTrxExpenseData
      }));
    }

    /** After Action Complete */
    this.transactionStore.select(transactionsSelectors.selectIsDataLoadedAfterAction)
      .pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res)),
        withLatestFrom(this.transactionStore.select(transactionsSelectors.selectCurrentTransaction))
      )
      .subscribe(([, transaction]) => {
        this.modalModeService.setModalMode(ModalMode.View);
        this.modalTransactionService.setCurrentTransaction(touchTransaction(this.accounts, transaction));
      });
  }

  getAddTrxExpenseData(formData): AddTrxExpenseDto {
    return {
      amount: this.total,
      date: moment(formData.date).format('YYYY-MM-DD'),
      party: formData.supplier,
      details: null,
      ref: formData.ref,
      type: TransactionType.Expense,
      direction: 'Sent',
      taxMode: this.getCurrentTaxMode(),
      lines: this.getAddTrxLinesDto(formData.lines),
      expense: this.getExpenseData()
    };
  }

  getExpenseData(): ExpenseModel {
    const form = this.form.value;
    const paidFromAccount = !!form.paidFrom.id;
    const id = this.modalMode === 'Edit' ? { id: this.currentExpense.expense.id } : {};

    return {
      ...id,
      paidFromType: paidFromAccount ? PaidFromTypes.Account : PaidFromTypes.Personal,
      paidFromAccountId: paidFromAccount ? form.paidFrom.id : null,
      needsReimbursed: form.needsReimbursed,
      whoPaidString: form.needsReimbursed ? form.reimburseString : null,
      whoPaidAccountId: !form.needsReimbursed && !paidFromAccount ? form.reimburseAccount?.id : null,
      dueDate: form.dueDate ? moment(form.dueDate).format('YYYY-MM-DD') : null
    };
  }

  getAddTrxLinesDto(lines): AddTransactionLineDto[] {
    return lines.map(line => ({
      description: line.description,
      amount: line.amount,
      accountId: line.expenseCategory.id,
      taxRate: line.taxRate
    }));
  }

  getTrxExpenseDataTypeEdit(formData): EditTrxExpenseDto {
    return {
      amount: this.total,
      id: this.currentExpense.id,
      date: moment(formData.date).format('YYYY-MM-DD'),
      party: formData.supplier,
      details: null,
      ref: formData.ref,
      type: TransactionType.Expense,
      direction: 'Sent',
      taxMode: this.getCurrentTaxMode(),
      lines: this.getEditTrxLinesDto(formData.lines),
      expense: this.getExpenseData()
    };
  }

  getEditTrxLinesDto(lines): EditTransactionLineDto[] {
    return lines.map(line => ({
      description: line.description,
      amount: line.amount,
      accountId: line.expenseCategory.id,
      taxRate: line.taxRate,
      id: line.id
    }));
  }

  isFormValid(): boolean {
    return this.form.valid && this.editableTableIsValid;
  }

  editButtonClick(): void {
    this.modalModeService.setModalMode(ModalMode.Edit);
  }

}
