import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { MatDialogRef } from '@angular/material/dialog';

import * as transactionsSelectors from '../../core/store/transactions/transactions.selectors';
import * as transactionSelectors from '../../core/store/transactions/transactions.selectors';
import * as transactionsActions from '../../core/store/transactions/transactions.actions';
import * as accountsSelectors from '../../core/store/accounts/accounts.selectors';
import { ModalLedgerComponent } from '../modal-ledger/modal-ledger.component';
import { AccountModel } from '../../core/interfaces/account.interface';
import { ISelectListGroup } from '../../shared/interfaces/select-control.interface';
import {
  LedgerItemModel,
  ManualLedgerItemDto,
  ManualLedgersDto,
  ManualLedgersModel,
  TransactionModel
} from '../../core/interfaces/transaction.interface';
import { ModalMode, TaxMode, TransactionType } from '../../core/constants/transaction.constants';
import { IAccountsState } from '../../core/store/accounts/accounts.reducer';
import { ITransactionsState } from '../../core/store/transactions/transactions.reducer';
import { ModalModeService } from '../../shared/services/modal-mode.service';
import { sortArrayByProperty } from '../../shared/utils/functions/helper.functions';
import { getAccountGroups } from '../../shared/utils/functions/get-account-groups.function';
import { ModalTransactionService } from '../../core/services/state/transactions/modal-transaction.service';
import { getAccountById } from '../../shared/utils/functions/get-account-by-id.function';
import { TransactionActionService } from '../../core/services/state/transactions/transaction-action.service';
import { mapEditTransactionModelToDto } from '../../core/mappers/transaction.mapper';

@Component({
  selector: 'app-manual-ledger-tab',
  templateUrl: './manual-ledger-tab.component.html',
  styleUrls: ['./manual-ledger-tab.component.scss']
})
export class ManualLedgerTabComponent implements OnInit, OnDestroy {

  @Input() accounts: AccountModel[];

  form: FormGroup;
  tableColumns: string[];
  groupedAccounts: ISelectListGroup<AccountModel[]>[];
  tableFormGroupRows$ = new BehaviorSubject<FormGroup[]>(null);
  tableIsValid: boolean;
  currentManualLedger: ManualLedgersModel | TransactionModel;
  transactionLedgerItemsList$ = this.transactionStore.select(transactionsSelectors.selectTransactionLedgerItemsList);
  transactionLedgerItemsIsLoading$: Observable<boolean> = this.transactionStore.select(transactionSelectors.selectIsLedgerItemsLoading);
  hasAssetAccount: boolean;

  subscription$ = new Subject();

  spinner$ = this.transactionStore.select(transactionsSelectors.selectIsSpinnerStarted);
  debit = 0;
  credit = 0;

  get modalMode(): ModalMode | string {
    return this.modalModeService.getModalMode();
  }

  constructor(
    private fb: FormBuilder,
    private accountsStore: Store<IAccountsState>,
    private transactionStore: Store<ITransactionsState>,
    public modalModeService: ModalModeService,
    public dialogRef: MatDialogRef<ModalLedgerComponent>,
    private modalTransactionService: ModalTransactionService,
    private transactionActionService: TransactionActionService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.accountsStore.select(accountsSelectors.selectAccountsData)
        .pipe(takeUntil(this.subscription$)),
      this.modalTransactionService.currentManualLedger$
        .pipe(takeUntil(this.subscription$))
    ]).subscribe(([accounts, currentManualLedger]) => {
      this.currentManualLedger = currentManualLedger;
      this.accounts = accounts;
      this.groupedAccounts = this.groupedAndSortedAccounts();
      this.fillFormGroup(this.currentManualLedger);
      this.setTableData(this.currentManualLedger.ledgerItems);
    });

    if (this.modalMode !== ModalMode.Add) {
      this.loadLedgers();
    }
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  loadLedgers(): void {
    this.transactionStore.dispatch(transactionsActions.transactionLedgerItems({
      transactionId: this.currentManualLedger.id
    }));

    this.transactionLedgerItemsList$
      .pipe(filter(res => Boolean(res), take(1)))
      .subscribe((ledgerItems: LedgerItemModel[]) => {
        this.currentManualLedger.ledgerItems = ledgerItems;
        this.setTableData(ledgerItems);
      });
  }

  setTableData(ledgerItems: ManualLedgerItemDto[]): void {
    this.tableColumns = ['remove', 'ledgerDate', 'account', 'debit', 'credit'];
    this.tableFormGroupRows$.next(
      ledgerItems.map((ledgerItem: LedgerItemModel) => this.fb.group({
        account: new FormControl(ledgerItem.accountId ? getAccountById(this.accounts, ledgerItem.accountId) : null, [Validators.required]),
        debit: new FormControl(ledgerItem.debit, [Validators.required]),
        credit: new FormControl(ledgerItem.credit, [Validators.required])
      }))
    );
  }

  groupedAndSortedAccounts(): ISelectListGroup<AccountModel[]>[] {
    return sortArrayByProperty<ISelectListGroup<AccountModel[]>>(Object.values(getAccountGroups(this.accounts)), 'displayName');
  }

  fillFormGroup(manualLedgersModel: ManualLedgersDto): void {
    this.form = this.fb.group({
      party: new FormControl(manualLedgersModel.party),
      date: new FormControl(
        manualLedgersModel.date
          ? moment(manualLedgersModel.date).format('YYYY-MM-DD')
          : moment().format('YYYY-MM-DD'),
        [Validators.required]),
      details: new FormControl(manualLedgersModel.details, [Validators.required]),
      ref: new FormControl(manualLedgersModel.ref),
      ledgerItems: new FormControl(manualLedgersModel.ledgerItems)
    });
  }

  setTransactionLines(event: FormArray): void {
    this.form.get('ledgerItems').patchValue(event.value);
    this.calculateAmountFields(event.value);
    this.cdr.detectChanges();
  }

  clickCancelButton(): void {
    if (this.modalMode === 'Add' || this.modalMode === 'View') {
      this.dialogRef.close();
    }

    if (this.modalMode === 'Edit') {
      this.fillFormGroup(this.currentManualLedger);
      this.setTableData(this.currentManualLedger.ledgerItems);
      this.modalModeService.setModalMode(ModalMode.View);
    }
  }

  isValid(): boolean {
    return this.form.valid && this.tableIsValid && this.debit === this.credit;
  }

  getTouchedLedger(): ManualLedgersDto {
    const formData = this.form.value;
    return {
      date: formData.date,
      details: formData.details,
      direction: 'Received',
      party: formData.party,
      ref: formData.ref,
      type: TransactionType.ManualLedger,
      ledgerItems: this.getTouchedLines(formData.ledgerItems, formData.date),
      amount: this.credit
    };
  }

  getEditTouchedTransaction(): TransactionModel {
    const formData = this.form.value;
    return {
      ...this.currentManualLedger as TransactionModel,
      ledgerItems: this.getLedgerItems(formData.ledgerItems, formData.date),
      type: TransactionType.ManualLedger,
      taxMode: TaxMode.NoTax,
      party: formData.party,
      details: formData.details,
      date: formData.date,
      ref: formData.ref,
      amount: this.credit
    };
  }

  getLedgerItems(lines: any, date: string): LedgerItemModel[] {
    return lines.map(line => ({ ...line, date }));
  }

  getTouchedLines(lines: any[], date: string): ManualLedgerItemDto[] {
    return lines.map(line => ({
      accountId: line.account.id,
      credit: line.credit,
      date,
      debit: line.debit
    }));
  }

  clickEditButton(): void {
    this.modalModeService.setModalMode(ModalMode.Edit);
  }

  clickSaveButton(): void {
    if (!this.isValid()) {
      return;
    }

    /** Dispatch New Manual Ledger Items */
    if (this.modalMode === ModalMode.Add) {
      const addManualLedger: ManualLedgersDto = this.getTouchedLedger();
      this.transactionStore.dispatch(transactionsActions.addTransaction({
        transaction: addManualLedger
      }));
    }

    /** Dispatch Edit Manual Ledger Items */
    if (this.modalMode === ModalMode.Edit) {
      const editedTransaction: TransactionModel = this.getEditTouchedTransaction();
      this.transactionStore.dispatch(transactionsActions.editTransaction({
        data: mapEditTransactionModelToDto(editedTransaction)
      }));
    }

    this.transactionStore.select(transactionsSelectors.selectIsDataLoadedAfterAction)
      .pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res)),
        withLatestFrom(this.transactionStore.select(
          transactionsSelectors.selectCurrentTransaction),
        )
      )
      .subscribe(([, transactionModel]: [any, TransactionModel]) => {
        this.modalTransactionService.setCurrentManualLedger(transactionModel);
        this.modalModeService.setModalMode(ModalMode.View);
      });
  }

  clickDeleteButton(): void {
    this.transactionActionService.deleteTransaction(this.currentManualLedger.id, 'Manual Ledger Items', this.dialogRef);
  }

  calculateAmountFields(lines: any[]): void {
    let debit = 0;
    let credit = 0;
    lines.forEach((line) => {
      const debitNum = Number(line.debit);
      const creditNum = Number(line.credit);
      debit += debitNum;
      credit += creditNum;
    });
    this.debit = Number(debit.toFixed(2));
    this.credit = Number(credit.toFixed(2));
  }
}
