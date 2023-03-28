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
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, takeUntil, withLatestFrom } from 'rxjs/operators';

import { IAccountsState } from '../../core/store/accounts/accounts.reducer';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { IOrganizationsState } from '../../core/store/organizations/organizations.reducer';
import { ModalMode } from '../../core/constants/transaction.constants';
import { LedgerItemModel, TransactionModel } from '../../core/interfaces/transaction.interface';
import { AccountModel } from '../../core/interfaces/account.interface';
import { sortArrayByProperty } from '../../shared/utils/functions/helper.functions';
import { getAccountGroups } from '../../shared/utils/functions/get-account-groups.function';
import { TransactionActionService } from '../../core/services/state/transactions/transaction-action.service';
import { ITransactionsState } from '../../core/store/transactions/transactions.reducer';
import * as transactionsSelectors from '../../core/store/transactions/transactions.selectors';
import * as transactionsActions from '../../core/store/transactions/transactions.actions';
import { ISelectListGroup } from '../../shared/interfaces/select-control.interface';
import { ModalTransactionService } from '../../core/services/state/transactions/modal-transaction.service';
import { mapEditTransactionModelToDto } from '../../core/mappers/transaction.mapper';
import { touchTransaction } from '../../shared/utils/functions/touch-transaction.function';
import { ModalModeService } from '../../shared/services/modal-mode.service';
import { getAccountById } from '../../shared/utils/functions/get-account-by-id.function';
import * as transactionSelectors from '../../core/store/transactions/transactions.selectors';
import { emptyContentLedgerItem } from '../../core/constants/empty-content.constant';
import { EmptyContentModel } from '../../core/interfaces/empty-content.interface';

@Component({
  selector: 'app-trx-ledger-tab',
  templateUrl: './trx-ledger-tab.component.html',
  styleUrls: ['./trx-ledger-tab.component.scss']
})
export class TrxLedgerTabComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() accounts: AccountModel[];

  @Output() closeModal = new EventEmitter();

  subscription$ = new Subject();
  spinner$ = this.transactionStore.select(transactionsSelectors.selectIsSpinnerStarted);
  transactionLedgerItemsList$ = this.transactionStore.select(transactionsSelectors.selectTransactionLedgerItemsList);
  transactionLedgerItemsIsLoading$: Observable<boolean> = this.transactionStore.select(
    transactionSelectors.selectIsLedgerItemsLoading
  );
  tableFormGroupRows$ = new BehaviorSubject<FormGroup[]>(null);

  groupedAccounts: ISelectListGroup<AccountModel[]>[];
  columns: string[];
  editableTableIsValid: boolean;
  transactionLedgerItems: LedgerItemModel[];
  emptyContentLedgerItem: EmptyContentModel = emptyContentLedgerItem;

  debit = 0;
  credit = 0;
  form: FormGroup = this.fb.group({ lines: new FormControl(null, [Validators.required]) });
  warningText = 'Warning. Editing your ledger manually can be dangerous if you do not know what you are doing.';
  isDirty: boolean;

  get modalMode(): ModalMode {
    return this.modalModeService.getModalMode();
  }

  constructor(
    private accountsStore: Store<IAccountsState>,
    private lSService: LocalStorageService,
    private organizationsStore: Store<IOrganizationsState>,
    private transactionStore: Store<ITransactionsState>,
    private fb: FormBuilder,
    private transactionService: TransactionActionService,
    private cdr: ChangeDetectorRef,
    public modalTransactionService: ModalTransactionService,
    private modalModeService: ModalModeService,
  ) {}

  ngOnInit(): void {
    this.transactionStore.dispatch(transactionsActions.transactionLedgerItems({
      transactionId: this.modalTransactionService.getCurrentTransaction().id
    }));

    this.transactionLedgerItemsList$
      .pipe(filter(res => Boolean(res), takeUntil(this.subscription$)))
      .subscribe( (ledgerItems: LedgerItemModel[]) => {
        this.groupedAccounts = this.groupedAndSortedAccounts(this.accounts);
        this.transactionLedgerItems = ledgerItems;
        this.setTableData(ledgerItems);
      });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  isEditable(): void {
    this.modalModeService.setModalMode(ModalMode.Edit);
    this.isDirty = false;
  }

  save(): void {
    if (this.isFormValid()) {
      const editTransactionData: TransactionModel = this.getTouchedTransactionData();
      this.transactionStore.dispatch(transactionsActions.editTransactionLedgerEntries({
        data: mapEditTransactionModelToDto(editTransactionData)
      }));
      this.transactionStore.select(transactionsSelectors.selectIsDataLoadedAfterAction)
        .pipe(
          takeUntil(this.subscription$),
          filter(res => Boolean(res)),
          withLatestFrom(this.transactionStore.select(transactionsSelectors.selectCurrentTransaction))
        )
        .subscribe(([, transaction]: [any, TransactionModel]) => {
          this.modalTransactionService.setCurrentTransaction(touchTransaction(this.accounts, transaction));
          this.transactionLedgerItems = transaction.ledgerItems;
          this.setTableData(transaction.ledgerItems);
          this.modalModeService.setModalMode(ModalMode.View);
        });
    }
  }

  setTableData(ledgerItems: LedgerItemModel[]): void {
    this.tableFormGroupRows$.next(this.fillLedgerEntriesGroups(ledgerItems));
    this.columns = ['remove', 'date', 'account', 'debit', 'credit'];
  }

  setAccountLines(event: FormArray): void {
    this.form.setControl('lines', event);
    this.calculateAmountFields(event);
    this.cdr.detectChanges();
  }

  fillLedgerEntriesGroups(rows: LedgerItemModel[]): FormGroup[] {
    return rows.map((row: LedgerItemModel) => this.fb.group({
      date: new FormControl(row.date, [Validators.required]),
      account: new FormControl(getAccountById(this.accounts, row.accountId), [Validators.required]),
      debit: new FormControl(row.debit, [Validators.required]),
      credit: new FormControl(row.credit, [Validators.required]),
      id: new FormControl(row.id, [Validators.required]),
      rule: new FormControl(row.rule, [Validators.required])
    }));
  }

  groupedAndSortedAccounts(accounts: AccountModel[]): ISelectListGroup<AccountModel[]>[] {
    return sortArrayByProperty<ISelectListGroup<AccountModel[]>>(Object.values(getAccountGroups(accounts)), 'displayName');
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  isBalanceEqual(): boolean {
    return this.debit === this.credit;
  }

  calculateAmountFields(lines: FormArray): void {
    let debit = 0;
    let credit = 0;
    lines.value.forEach((line) => {
      const debitNum = Number(line.debit);
      const creditNum = Number(line.credit);
      debit += debitNum;
      credit += creditNum;
    });
    this.debit = Number(debit.toFixed(2));
    this.credit = Number(credit.toFixed(2));

  }

  getTouchedTransactionData(): TransactionModel {
    const ledgerItems: LedgerItemModel[] = this.form.get('lines').value.map((ledger: LedgerItemModel) => ({
      ...ledger,
      transactionId: this.modalTransactionService.getCurrentTransaction().id
    }));
    return {
      ...this.modalTransactionService.getCurrentTransaction(),
      ledgerItems,
      hasManualLedger: this.isDirty,
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
    this.setTableData(this.transactionLedgerItems);
  }

}
