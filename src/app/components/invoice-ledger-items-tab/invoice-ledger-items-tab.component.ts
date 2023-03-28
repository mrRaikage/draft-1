import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, takeUntil, withLatestFrom } from 'rxjs/operators';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';

import * as invoicesSelectors from '../../core/store/invoices/invoices.selectors';
import * as invoicesActions from '../../core/store/invoices/invoices.actions';
import * as accountsSelectors from '../../core/store/accounts/accounts.selectors';
import { InvoiceModel } from '../../core/interfaces/invoice.interface';
import { ModalInvoiceService } from '../../core/services/state/invoices/modal-invoice.service';
import { LedgerItemModel, TransactionModel } from '../../core/interfaces/transaction.interface';
import { ISelectListGroup } from '../../shared/interfaces/select-control.interface';
import { AccountModel } from '../../core/interfaces/account.interface';
import { IAccountsState } from '../../core/store/accounts/accounts.reducer';
import { sortArrayByProperty } from '../../shared/utils/functions/helper.functions';
import { getAccountGroups } from '../../shared/utils/functions/get-account-groups.function';
import { getAccountById } from '../../shared/utils/functions/get-account-by-id.function';
import { ModalMode } from '../../core/constants/transaction.constants';
import { mapEditTransactionModelToDto } from '../../core/mappers/transaction.mapper';
import { touchInvoice } from '../../shared/utils/functions/touch-transaction.function';
import { ModalModeService } from '../../shared/services/modal-mode.service';
import { IInvoicesState } from '../../core/store/invoices/invoices.reducer';
import { emptyContentLedgerItem } from '../../core/constants/empty-content.constant';
import { EmptyContentModel } from '../../core/interfaces/empty-content.interface';

@Component({
  selector: 'app-invoice-ledger-items-tab',
  templateUrl: './invoice-ledger-items-tab.component.html',
  styleUrls: ['./invoice-ledger-items-tab.component.scss']
})
export class InvoiceLedgerItemsTabComponent implements OnInit, OnDestroy {

  @Output() closeModal = new EventEmitter();

  columns: string[];
  invoiceLedgerItems: LedgerItemModel[];
  form: FormGroup = this.fb.group({
    lines: new FormControl(null, [Validators.required])
  });
  debit = 0;
  credit = 0;
  accounts: AccountModel[];
  warningText = 'Warning. Editing your ledger manually can be dangerous if you do not know what you are doing.';
  isDirty: boolean;
  emptyContentLedgerItem: EmptyContentModel = emptyContentLedgerItem;

  groupedAccounts: ISelectListGroup<AccountModel[]>[];
  tableFormGroupRows$ = new BehaviorSubject<FormGroup[]>(null);
  invoiceLedgerItemsList$: Observable<LedgerItemModel[]> = this.invoiceStore.select(invoicesSelectors.selectInvoiceLedgerItemsList);
  invoiceLedgerItemsIsLoading$: Observable<boolean> = this.invoiceStore.select(invoicesSelectors.selectIsLedgerItemsLoading);
  spinner$: Observable<boolean> = this.invoiceStore.select(invoicesSelectors.selectIsSpinnerStarted);
  subscription$ = new Subject();

  get modalMode(): ModalMode {
    return this.modalModeService.getModalMode();
  }

  constructor(
    private invoiceStore: Store<IInvoicesState>,
    public modalInvoiceService: ModalInvoiceService,
    private modalModeService: ModalModeService,
    private fb: FormBuilder,
    private accountsStore: Store<IAccountsState>,
    private cdr: ChangeDetectorRef
  ) {
    this.invoiceStore.dispatch(invoicesActions.invoiceLedgerItems({
      invoiceId: this.modalInvoiceService.getCurrentInvoice().id
    }));

    combineLatest([
      this.accountsStore.select(accountsSelectors.selectAccountsData)
        .pipe(filter(res => Boolean(res)), takeUntil(this.subscription$)),
      this.invoiceLedgerItemsList$
        .pipe(filter(res => Boolean(res)), takeUntil(this.subscription$))
    ])
      .subscribe(([accounts, ledgerItems]: [AccountModel[], LedgerItemModel[]]) => {
        this.accounts = accounts;
        this.groupedAccounts = this.groupedAndSortedAccounts(accounts);
        this.invoiceLedgerItems = ledgerItems;
        this.setTableData(ledgerItems);
      });

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  setTableData(invoiceLedgerItems: LedgerItemModel[]): void {
    this.tableFormGroupRows$.next(this.fillLedgerEntriesGroups(invoiceLedgerItems));
    this.columns = ['remove', 'date', 'account', 'debit', 'credit'];
  }

  fillLedgerEntriesGroups(rows: LedgerItemModel[]): FormGroup[] {
    const trxDate: string = this.modalInvoiceService.getCurrentInvoice().date;
    return rows.map((row: LedgerItemModel) => this.fb.group({
      date: new FormControl(row.date || trxDate, [Validators.required]),
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

  setAccountLines(event: FormArray): void {
    this.form.setControl('lines', event);
    this.calculateAmountFields(event);
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
    this.cdr.detectChanges();
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  isBalanceEqual(): boolean {
    return this.debit === this.credit;
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const touchedTransaction = this.getTouchedTransactionData();
    this.invoiceStore.dispatch(invoicesActions.editInvoiceLedgerItems(
      { transaction: mapEditTransactionModelToDto(touchedTransaction) })
    );
    this.invoiceStore.select(invoicesSelectors.selectIsDataLoadedAfterAction)
      .pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res)),
        withLatestFrom(
          this.invoiceStore.select(invoicesSelectors.selectCurrentInvoice),
          this.invoiceStore.select(invoicesSelectors.selectInvoiceLedgerItemsList)
        )
      )
      .subscribe(([, invoice, ledgerItems]: [any, InvoiceModel, LedgerItemModel[]]) => {
        this.modalInvoiceService.setCurrentInvoice(touchInvoice(this.accounts, invoice));
        this.invoiceLedgerItems = ledgerItems;
        this.setTableData(ledgerItems);
        this.modalModeService.setModalMode(ModalMode.View);
      });
  }

  isEditable(): void {
    this.modalModeService.setModalMode(ModalMode.Edit);
    this.isDirty = false;
  }

  cancel(): void {
    if (this.modalMode === 'View' || this.modalMode === 'Add') {
      this.closeModal.emit();
    }

    if (this.modalMode === 'Edit') {
      this.setTableData(this.invoiceLedgerItems);
      this.modalModeService.setModalMode(ModalMode.View);
    }
  }

  // TODO: Need to refactor
  getTouchedTransactionData(): TransactionModel {
    const ledgerItems: LedgerItemModel[] = this.form.get('lines').value.map((ledger: LedgerItemModel) => ({
      ...ledger,
      transactionId: this.modalInvoiceService.getCurrentInvoice().id
    }));
    return {
      amount: 0, date: '', details: '', id: '', tax: 0, taxMode: undefined, type: undefined,
      direction: '', expense: null, lines: [], party: '', ref: '', subTotal: 0,
      invoice: this.modalInvoiceService.getCurrentInvoice(),
      ledgerItems,
      hasManualLedger: this.isDirty,
    };
  }
}
