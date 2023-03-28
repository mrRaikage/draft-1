import {
  AfterViewChecked,
  AfterViewInit,
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
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil, withLatestFrom } from 'rxjs/operators';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { MatDialogRef } from '@angular/material/dialog';

import {
  emptyTransactionLine,
  ModalMode,
  TaxMode,
  taxModel,
} from '../../core/constants/transaction.constants';
import { BaseControlValueAccessor } from '../../shared/components/form-controls/base-control-value-accessor';
import { IAccountsState } from '../../core/store/accounts/accounts.reducer';
import { IOrganizationsState } from '../../core/store/organizations/organizations.reducer';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { ITransactionsState } from '../../core/store/transactions/transactions.reducer';
import { mapAddTransactionModelToDto, mapEditTransactionModelToDto } from '../../core/mappers/transaction.mapper';
import * as transactionsActions from '../../core/store/transactions/transactions.actions';
import * as transactionsSelectors from '../../core/store/transactions/transactions.selectors';
import { sortArrayByProperty } from '../../shared/utils/functions/helper.functions';
import { getAccountGroups } from '../../shared/utils/functions/get-account-groups.function';
import { TransactionActionService } from '../../core/services/state/transactions/transaction-action.service';
import { AccountModel } from '../../core/interfaces/account.interface';
import { ISelectListGroup, ISelectListItem } from '../../shared/interfaces/select-control.interface';
import { getAccountById } from '../../shared/utils/functions/get-account-by-id.function';
import { ModalTransactionService } from '../../core/services/state/transactions/modal-transaction.service';
import { touchTransaction } from '../../shared/utils/functions/touch-transaction.function';
import { TransactionLineModel, TransactionModel } from '../../core/interfaces/transaction.interface';
import { ModalModeService } from '../../shared/services/modal-mode.service';
import { ModalInvoiceComponent } from '../modal-invoice/modal-invoice.component';

@Component({
  selector: 'app-trx-tab',
  templateUrl: './trx-tab.component.html',
  styleUrls: ['./trx-tab.component.scss']
})
export class TrxTabComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  @Input() accounts: AccountModel[];

  @Output() closeModal = new EventEmitter<any>();

  spinner$ = this.transactionStore.select(transactionsSelectors.selectIsSpinnerStarted);
  subscription$ = new Subject();
  isDeleting$ = new BehaviorSubject<boolean>(false);
  tableFormGroupRows$ = new BehaviorSubject<FormGroup[]>(null);

  groupedAccounts: ISelectListGroup<AccountModel[]>[];
  cashAccounts: ISelectListItem<AccountModel>[];
  taxModeList: ISelectListItem<string>[];
  currentTransaction: TransactionModel;
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
    public modalTransactionService: ModalTransactionService,
    public modalModeService: ModalModeService,
    private dialogRef: MatDialogRef<ModalInvoiceComponent>
  ) { }

  ngOnInit(): void {
    this.modalTransactionService.currentTransaction$
      .pipe(takeUntil(this.subscription$))
      .subscribe((value: TransactionModel) => {
        this.currentTransaction = value;
        this.setTableData();
      });
    this.groupedAccounts = this.groupedAndSortedAccounts();
    this.cashAccounts = this.selectOnlyCashAccounts();
    this.taxModeList = Object.values(taxModel);
    this.fillFormGroup();
    this.setTableData();

    this.form.get('taxMode').valueChanges.pipe(takeUntil(this.subscription$)).subscribe((taxMode) => {
      const lines = this.form.get('lines').value;
      this.calculateAmountFields(lines, taxMode);
    });
  }

  ngAfterViewInit(): void {}

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  setTableData(): void {
    this.tableFormGroupRows$.next(this.fillLinesGroups((this.currentTransaction.lines) || [emptyTransactionLine]));
    this.tableColumns = ['remove', 'description', 'account', 'taxRate', 'amount'];
    this.requiredColumns = ['account', 'taxRate', 'amount'];
  }

  save(): void {
    if (this.isFormValid()) {

      const hasAssetAccount = !!this.form.value.lines
        .find(item => item.account.accountType.parentType === 'Assets');

      if (this.modalMode === ModalMode.Add) {
        const addTransactionData: TransactionModel = this.getTransactionDataTypeAdd();
        this.transactionStore.dispatch(transactionsActions.addTransaction({
          transaction: mapAddTransactionModelToDto(addTransactionData),
          hasAssetAccount
        }));
      }

      if (this.modalMode === ModalMode.Edit) {
        const editedTransactionData: TransactionModel = this.getTransactionDataTypeEdit();
        this.transactionStore.dispatch(transactionsActions.editTransaction({
          data: mapEditTransactionModelToDto(editedTransactionData),
          hasAssetAccount
        }));
      }

      this.transactionStore.select(transactionsSelectors.selectIsDataLoadedAfterAction)
        .pipe(
          takeUntil(this.subscription$),
          filter(res => Boolean(res)),
          withLatestFrom(this.transactionStore.select(transactionsSelectors.selectCurrentTransaction))
        )
        .subscribe(([, transaction]) => {
          this.modalTransactionService.setCurrentTransaction(touchTransaction(this.accounts, transaction));
          this.modalModeService.setModalMode(ModalMode.View);
          this.fillFormGroup();
        });

    }
  }

  delete(): void {
    this.isDeleting$.next(true);
    this.transactionService.deleteTransaction(this.currentTransaction.id, 'transaction', this.dialogRef);
  }

  fillLinesGroups(rows: TransactionLineModel[]): FormGroup[] {
    return rows.map((row: TransactionLineModel) => this.fb.group({
      account: new FormControl(row.account, [Validators.required]),
      description: new FormControl(row.description),
      taxRate: new FormControl(row.taxRate, [Validators.required]),
      amount: new FormControl(row.amount, [Validators.required]),
      id: new FormControl(row.id)
    }));
  }

  isEditable(): void {
    this.modalModeService.setModalMode(ModalMode.Edit);
  }

  setTransactionLines(event: FormArray): void {
    this.form.get('lines').patchValue(event.value);

    const taxMode = this.getCurrentTaxMode();
    this.calculateAmountFields(event.value, taxMode);
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

  isFormValid(): boolean {
    return this.form.valid && this.editableTableIsValid;
  }

  groupedAndSortedAccounts(): ISelectListGroup<AccountModel[]>[] {
    return sortArrayByProperty<ISelectListGroup<AccountModel[]>>(Object.values(getAccountGroups(this.accounts)), 'displayName');
  }

  selectOnlyCashAccounts(): ISelectListItem<AccountModel>[] {
    return this.accounts.filter((account: AccountModel) => Boolean(account.isCash))
      .map((account: AccountModel) => ({ displayName: account.name, value: account }));
  }

  fillFormGroup(): void {
    const cashAccount = this.currentTransaction.linkedCashAccountId
      ? getAccountById(this.accounts, this.currentTransaction.linkedCashAccountId)
      : null;

    this.form = this.fb.group({
      party: new FormControl(this.currentTransaction.party, [Validators.required]),
      cashAccount: new FormControl(
        cashAccount
          ? { displayName: cashAccount.name, value: cashAccount }
          : null,
        [Validators.required]
      ),
      direction: new FormControl(this.currentTransaction.direction || 'Sent'),
      date: new FormControl(this.currentTransaction.date || moment(), [Validators.required]),
      details: new FormControl(this.currentTransaction.details, [Validators.required]),
      ref: new FormControl(this.currentTransaction.ref),
      taxMode: new FormControl(this.currentTransaction.taxMode || TaxMode.Inclusive, [Validators.required]),
      lines: new FormControl(this.currentTransaction.lines, [Validators.required]),
    });
  }

  getCurrentTaxMode(): TaxMode {
    return this.form.get('taxMode').value;
  }

  getTransactionDataTypeAdd(): TransactionModel {
    const form = this.form.value;
    return {
      ...form,
      type: 'Cash',
      date: moment(form.date).format(),
      ledgerItems: null,
      party: form.party,
      linkedCashAccountId: form.cashAccount.value
        ? form.cashAccount.value.id
        : null,
      taxMode: form.taxMode,
      invoice: null,
      amount: this.total,
      subTotal: this.subtotal,
      tax: this.tax,
    };
  }

  getTransactionDataTypeEdit(): TransactionModel {
    const form = this.form.value;
    return {
      ...form,
      ref: form.ref || this.currentTransaction.ref,
      type: this.currentTransaction.type,
      date: moment(form.date).format(),
      ledgerItems: this.currentTransaction.ledgerItems,
      id: this.currentTransaction.id,
      party: form.party,
      linkedCashAccountId: form.cashAccount.value
        ? form.cashAccount.value.id
        : null,
      taxMode: form.taxMode,
      invoice: null,
      ModifiedTransactionLines: this.linesIsTouched,
      amount: this.total,
      subTotal: this.subtotal,
      tax: this.tax,
    };
  }

  cancel(): void {
    if (this.modalMode === 'View' || this.modalMode === 'Add') {
      this.closeModal.emit();
    }

    if (this.modalMode === 'Edit') {
      this.resetCurrentModal();
      this.modalModeService.setModalMode(ModalMode.View);
    }

  }

  resetCurrentModal(): void {
    this.currentTransaction = this.modalTransactionService.getCurrentTransaction();
    this.fillFormGroup();
    this.setTableData();
  }

  setError(control: AbstractControl, isError): void {
    control.setErrors(isError ? { incorrect: true } : null);
  }
}
