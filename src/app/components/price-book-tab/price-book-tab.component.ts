import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, takeUntil, withLatestFrom } from 'rxjs/operators';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ChargeModel } from '../../core/interfaces/job.interface';

import { ModalMode } from '../../core/constants/transaction.constants';
import { ModalClientsService } from '../../core/services/state/clients/modal-clients.service';
import { ModalModeService } from '../../shared/services/modal-mode.service';
import * as accountsSelectors from '../../core/store/accounts/accounts.selectors';
import * as priceBookActions from '../../core/store/prce-book/price-book.actions';
import * as priceBookSelectors from '../../core/store/prce-book/price-book.selectors';
import { ClientModel } from '../../core/interfaces/clients.interface';
import { IClientsState } from '../../core/store/clients/clients.reducer';
import { ISelectListGroup } from '../../shared/interfaces/select-control.interface';
import { AccountModel } from '../../core/interfaces/account.interface';
import { IAccountsState } from '../../core/store/accounts/accounts.reducer';
import { getAccountById } from '../../shared/utils/functions/get-account-by-id.function';
import { PriceBookItemModel } from '../../core/interfaces/price-book.interface';
import { IPriceBookState } from '../../core/store/prce-book/price-book.reducer';
import { emptyContentPriceBook } from '../../core/constants/empty-content.constant';
import { EmptyContentModel } from '../../core/interfaces/empty-content.interface';

@Component({
  selector: 'app-price-book-tab',
  templateUrl: './price-book-tab.component.html',
  styleUrls: ['./price-book-tab.component.scss']
})
export class PriceBookTabComponent implements OnInit, OnDestroy {

  @Output() closeModal = new EventEmitter();

  columns: string[];
  clientPriceBookItems: PriceBookItemModel[];
  formControl: FormControl = this.fb.control(null);
  checkboxControl: FormControl = this.fb.control(false);
  currentClient: ClientModel;
  subscription$ = new Subject();
  accounts: AccountModel[];
  groupedAccounts: ISelectListGroup<AccountModel[]>[];
  emptyContentPriceBook: EmptyContentModel = emptyContentPriceBook;

  tableFormGroupRows$ = new BehaviorSubject<FormGroup[]>(null);
  spinner$: Observable<boolean> = this.priceBookStore.select(priceBookSelectors.selectSpinner);
  priceBookIsLoading$: Observable<boolean> = this.priceBookStore.select(priceBookSelectors.selectDataIsLoading);
  linesIsValid: boolean;
  showInactive$ = new BehaviorSubject(false);

  get modalMode(): ModalMode {
    return this.modalModeService.getModalMode();
  }

  get showInactive(): boolean {
    return this.showInactive$.value;
  }

  setShowInactive(value: boolean): void {
    this.showInactive$.next(value);
  }

  constructor(
    public modalClientsService: ModalClientsService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private modalModeService: ModalModeService,
    private clientStore: Store<IClientsState>,
    private accountsStore: Store<IAccountsState>,
    private priceBookStore: Store<IPriceBookState>
  ) {

    /** Get Client Price Book Data */
    this.priceBookStore.dispatch(priceBookActions.clientPriceBook({
      clientId: this.modalClientsService.getCurrentClient().id
    }));

    this.priceBookStore.select(priceBookSelectors.selectClientPriceBook).pipe(
      takeUntil(this.subscription$),
      filter( res => Boolean(res)),
      withLatestFrom(this.accountsStore.select(accountsSelectors.selectAccountsData))
    )
    .subscribe(([clientPriceBookItems, accounts]: [PriceBookItemModel[], AccountModel[]]) => {
      this.clientPriceBookItems = clientPriceBookItems;
      this.accounts = accounts;
      this.groupedAccounts = [{
        displayName: 'Revenue',
        children: accounts.filter(item => item.accountType.parentType === 'Revenue')
      }];
      this.setTableData();
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  saveButtonClick(): void {
    if (!this.isFormValid()) {
      return;
    }

    const inactive: PriceBookItemModel[] = !this.showInactive
      ? this.clientPriceBookItems.filter(item => item.status === 'Inactive')
      : [];

    this.priceBookStore.dispatch(priceBookActions.editClientPriceBook({
      data: [...this.getTouchedPriceBookData(this.formControl.value), ...inactive],
      clientId: this.modalClientsService.getCurrentClient().id
      })
    );

    this.priceBookStore.select(priceBookSelectors.selectIsLoadAfterAction)
      .pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res)),
        withLatestFrom(this.priceBookStore.select(
          priceBookSelectors.selectClientPriceBook)
        )
      )
      .subscribe(([, clientPriceBook]: [any, PriceBookItemModel[]]) => {
        this.modalModeService.setModalMode(ModalMode.View);
        this.fillPriceBookGroups(clientPriceBook);
      });
  }

  cancelButtonClick(): void {
    if (this.modalMode === 'View' || this.modalMode === 'Add') {
      this.closeModal.emit();
    }

    if (this.modalMode === 'Edit') {
      this.modalModeService.setModalMode(ModalMode.View);
      this.setTableData();
    }
  }

  setTableData(): void {
    this.tableFormGroupRows$.next(this.fillPriceBookGroups(this.clientPriceBookItems));
    this.columns = ['remove', 'editableStatus', 'unit', 'rate', 'revenueAccounts'];
  }

  fillPriceBookGroups(rows: PriceBookItemModel[]): FormGroup[] {
    return rows.map((row: PriceBookItemModel) => this.fb.group({
      editableStatus: new FormControl(row.status,  [Validators.required]),
      unit: new FormControl(row.unit, [Validators.required]),
      rate: new FormControl(row.rate, [Validators.required]),
      revenueAccounts: new FormControl(row.accountId ? getAccountById(this.accounts, row.accountId) : null, [Validators.required]),
      id: new FormControl(row.id, [Validators.required]),
      clientId: new FormControl(row.clientId, [Validators.required]),
    }));
  }

  editButtonClick(): void {
    this.modalModeService.setModalMode(ModalMode.Edit);
  }

  setPriceBookLines(event: FormArray): void {
    this.formControl.setValue( event.value );
    this.cdr.detectChanges();
  }

  getTouchedPriceBookData(priceBookData: any): PriceBookItemModel[] {
    return priceBookData.map(item => ({
      unit: item.unit,
      rate: item.rate,
      status: item.editableStatus,
      accountId: item.revenueAccounts ? item.revenueAccounts.id : null,
      id: item.id,
      clientId: item.clientId ? item.clientId : this.modalClientsService.getCurrentClient().id
    }));
  }

  isFormValid(): boolean {
    return this.formControl.valid && this.linesIsValid;
  }

}
