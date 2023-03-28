import { ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import * as moment from 'moment';

import { AccountModel } from '../../core/interfaces/account.interface';
import { ClientsActionsService } from '../../core/services/state/clients/clients-actions.service';
import { IAccountsState } from '../../core/store/accounts/accounts.reducer';
import { ClientModel } from '../../core/interfaces/clients.interface';
import { IClientsState } from '../../core/store/clients/clients.reducer';
import { PriceBookItemModel } from '../../core/interfaces/price-book.interface';
import { IPriceBookState } from '../../core/store/prce-book/price-book.reducer';
import { SelectOptGroupQuickAddComponent } from '../../shared/components/form-controls/select-opt-group-quick-add/select-opt-group-quick-add.component';
import { EditableTableComponent } from '../../shared/components/editable-table/editable-table.component';
import { ISelectListGroup, ISelectListItem } from '../../shared/interfaces/select-control.interface';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { ModalModeService } from '../../shared/services/modal-mode.service';
import { getAccountById } from '../../shared/utils/functions/get-account-by-id.function';
import { getAccountGroups } from '../../shared/utils/functions/get-account-groups.function';
import { sortArrayByProperty } from '../../shared/utils/functions/helper.functions';
import { touchInvoice } from '../../shared/utils/functions/touch-transaction.function';
import { ModalInvoiceComponent } from '../modal-invoice/modal-invoice.component';
import * as invoicesActions from '../../core/store/invoices/invoices.actions';
import * as invoicesSelectors from '../../core/store/invoices/invoices.selectors';
import * as accountsSelectors from '../../core/store/accounts/accounts.selectors';
import * as clientsActions from '../../core/store/clients/clients.actions';
import * as clientsSelectors from '../../core/store/clients/clients.selectors';
import * as priceBookActions from '../../core/store/prce-book/price-book.actions';
import * as priceBookSelectors from '../../core/store/prce-book/price-book.selectors';
import { InvoiceLineModel, InvoiceModel } from '../../core/interfaces/invoice.interface';
import {
  InvoiceType,
  ModalMode,
  TaxMode,
  taxModel,
  TransactionType
} from '../../core/constants/transaction.constants';
import { ModalInvoiceService } from '../../core/services/state/invoices/modal-invoice.service';
import { IInvoicesState } from '../../core/store/invoices/invoices.reducer';
import { InvoiceActionsService } from '../../core/services/state/invoices/invoice-actions.service';
import { mapAddInvoiceModelToDto, mapEditInvoiceModelToDto } from '../../core/mappers/invoices.mappers';

@Component({
  selector: 'app-invoice-tab',
  templateUrl: './invoice-tab.component.html',
  styleUrls: ['./invoice-tab.component.scss']
})
export class InvoiceTabComponent implements OnInit, OnDestroy {

  @Input() accounts: AccountModel[];

  form: FormGroup;
  isDeleting$ = new BehaviorSubject<boolean>(false);
  formMarkAsPaid: FormGroup;
  currentInvoice: InvoiceModel;
  invoiceType: InvoiceType;
  taxModeList: ISelectListItem<string>[];
  cashAccountsSelectList: ISelectListItem<AccountModel>[];
  tableIsValid: boolean;
  markAsPaidOption = false;
  invoiceStatus: string;
  clients: ClientModel[];
  clientsSelectList: ISelectListGroup<ClientModel[]>[];
  subtotal = 0;
  tax = 0;
  total = 0;
  gst = 3 / 23;
  warningText = `<div>Warning. The Ledger entries for these invoices have been edited.</div>
                 <div>Saving changes to these invoice lines will reset the ledger.</div>`;

  tableFormGroupRows$ = new BehaviorSubject<FormGroup[]>(null);
  spinner$ = this.invoicesStore.select(invoicesSelectors.selectIsSpinnerStarted);
  subscription$ = new Subject();
  clients$: Observable<ClientModel[]> = this.clientsStore.select(clientsSelectors.selectClients);

  tableColumns: string[];
  invoiceNumberLoading$: Observable<boolean> = this.invoicesStore.select(invoicesSelectors.selectInvoiceNumberLoading);
  groupedAccounts$: Observable<ISelectListGroup<AccountModel[]>[]> = this.accountsStore.select(accountsSelectors.selectAccountsData)
    .pipe(
      filter((accounts: AccountModel[]) => Boolean(accounts)),
      map((accounts: AccountModel[]) => {
        if (this.invoiceType === InvoiceType.Invoice) {
          return [{
            displayName: 'Revenue',
            children: accounts.filter(item => item.accountType.parentType === 'Revenue')
          }];
        } else {
          return sortArrayByProperty<ISelectListGroup<AccountModel[]>>(Object.values(getAccountGroups(accounts)), 'displayName');
        }
      })
    );

  /** Grouped Price Book Items */
  groupedPriceBookItems$: Observable<ISelectListGroup<PriceBookItemModel[]>[]> =
    combineLatest([
      this.priceBookStore.select(priceBookSelectors.selectClientPriceBook).pipe(filter(item => Boolean(item))),
      this.priceBookStore.select(priceBookSelectors.selectOrgPriceBook).pipe(filter(item => Boolean(item)))
    ])
      .pipe(
        map(([clientPriceBook, orgPriceBook]) => {

          const groupedOrg = {
            displayName: 'Standard Charges',
            children: orgPriceBook
              .filter((priceBookItem: PriceBookItemModel) => priceBookItem.status === 'Active')
              .map((priceBookItem: PriceBookItemModel) => ({
                ...priceBookItem,
                name: priceBookItem.unit,
                code: priceBookItem.rate
              }))
          };

          const groupedClient = {
            displayName: 'Client Charges',
            children: clientPriceBook
              .filter((priceBookItem: PriceBookItemModel) => priceBookItem.status === 'Active')
              .map((priceBookItem: PriceBookItemModel) => ({
                ...priceBookItem,
                name: priceBookItem.unit,
                code: priceBookItem.rate
              }))
          };

          return [groupedClient, groupedOrg];
        })
      );

  @ViewChild('quickAddClientComp') quickAddClientComponent: SelectOptGroupQuickAddComponent;

  get modalMode(): ModalMode | string {
    return this.modalModeService.getModalMode();
  }

  get taxRegistered(): boolean {
    return this.lSService.getCurrentOrg().settings
      ? this.lSService.getCurrentOrg().settings.taxRegistered
      : true;
  }

  get defaultTax(): string {
    return this.lSService.getCurrentOrg().settings
      ? this.lSService.getCurrentOrg().settings.invoiceDefaultTaxMode
      : TaxMode.NoTax;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalInvoiceComponent>,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public modalInvoiceService: ModalInvoiceService,
    private accountsStore: Store<IAccountsState>,
    private invoicesStore: Store<IInvoicesState>,
    private clientStore: Store<IClientsState>,
    private priceBookStore: Store<IPriceBookState>,
    private cdr: ChangeDetectorRef,
    private lSService: LocalStorageService,
    private modalModeService: ModalModeService,
    private invoiceActionService: InvoiceActionsService,
    private clientsStore: Store<IClientsState>,
    private clientActionsService: ClientsActionsService
  ) {
    dialogRef.disableClose = true;

    this.accountsStore.select(accountsSelectors.selectAccountsData)
      .pipe(takeUntil(this.subscription$))
      .subscribe((accounts: AccountModel[]) => this.accounts = accounts);

    this.clientStore.select(clientsSelectors.selectClients)
      .pipe(takeUntil(this.subscription$))
      .subscribe((clients: ClientModel[]) => {
        this.clients = clients;
        this.setClientsSelectList(clients);
      });

    this.modalInvoiceService.currentInvoice$
      .pipe(takeUntil(this.subscription$))
      .subscribe((invoice: InvoiceModel) => {
        this.currentInvoice = invoice;
        this.invoiceStatus = invoice.status;
        this.invoiceType = this.modalInvoiceService.getInvoiceType();

        /** Dispatch Price Book Action */
        this.priceBookStore.dispatch(priceBookActions.orgPriceBook());

        if (invoice.clientId) {
          this.priceBookStore.dispatch(priceBookActions.clientPriceBook({ clientId: invoice.clientId }));
          this.clientStore.dispatch(clientsActions.clientById({ clientId: invoice.clientId }));
        } else {
          this.priceBookStore.dispatch(priceBookActions.clientPriceBookSuccess({ priceBook: null }));
        }

        if (
          this.modalMode === 'View' &&
          this.invoiceType === InvoiceType.Invoice &&
          this.invoiceStatus !== 'Draft'
        ) {
          this.invoicesStore.dispatch(invoicesActions.pdfGenerationStatus({
            id: this.currentInvoice.id
          }));
        }

        this.cashAccountsSelectList = this.accounts
          .filter((account: AccountModel) => Boolean(account.isCash))
          .map((account: AccountModel) => ({ displayName: account.name, value: account }));
        this.taxModeList = Object.values(taxModel);
        this.setClientsSelectList(this.clients);
        this.fillFormGroup(this.currentInvoice, this.getClientById(this.currentInvoice.clientId, this.clients));

        if (invoice.status === 'Paid') {
          this.fillMarkAsPaidForm();
        }
        this.setTableData(this.currentInvoice.invoiceLines);
      });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  quickAddClient(newClient: string): void {
    this.clientStore.dispatch(clientsActions.addClient({ addClient: { name: newClient } }));
    this.clientStore.select(clientsSelectors.selectClient)
      .pipe(filter(res => Boolean(res)), take(1))
      .subscribe((client: ClientModel) => {
        this.form.get('client').setValue(client);
        this.quickAddClientComponent.closePanel();
      });
  }

  getClientById(id: string, clients: ClientModel[]): ClientModel {
    return clients.find((client: ClientModel) => client.id === id);
  }

  getClientNameById(id: string, clients: ClientModel[]): string {
    return this.getClientById(id, clients)?.name;
  }

  setClientsSelectList(clients: ClientModel[]): void {
    this.clientsSelectList = [{ displayName: 'Clients', children: clients }];
  }

  setError(control: AbstractControl, isError): void {
    control.setErrors(isError ? { incorrect: true } : null);
  }

  setInvoiceNumberControl(): void {
    this.invoicesStore.dispatch(invoicesActions.invoicesNumber());
    this.invoicesStore.select(invoicesSelectors.selectInvoiceNumber)
      .pipe(takeUntil(this.subscription$))
      .subscribe((data: string) => {
        this.form.get('invoiceNumber').setValue(data);
      });
  }

  saveNewInvoiceButtonClick(): void {
    if (this.form.invalid) {
      return;
    }

    if (this.invoiceType === InvoiceType.Invoice) {
      const addInvoice: InvoiceModel = this.getTouchedInvoice();
      this.invoicesStore.dispatch(invoicesActions.addInvoice({
        invoice: mapAddInvoiceModelToDto(addInvoice)
      }));
    }

    if (this.invoiceType === InvoiceType.Bill) {
      const hasAssetAccount = !!this.form.value.invoiceLines
        .find(item => item.account.accountType.parentType === 'Assets');

      const addBill: InvoiceModel = this.getTouchedBill();
      this.invoicesStore.dispatch(invoicesActions.addInvoice({
        invoice: mapAddInvoiceModelToDto(addBill),
        hasAssetAccount
      }));
    }

    this.invoicesStore.select(invoicesSelectors.selectIsDataLoadedAfterAction)
      .pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res)),
        withLatestFrom(
          this.invoicesStore.select(invoicesSelectors.selectCurrentInvoice)
        )
      )
      .subscribe(([, invoice]) => {
        this.form.reset();
        this.modalInvoiceService.setCurrentInvoice(touchInvoice(this.accounts, invoice));
        this.setTableData(this.currentInvoice.invoiceLines);
        this.modalModeService.setModalMode(ModalMode.View);
      });
  }

  saveButtonClick(): void {
    if (this.form.invalid) {
      return;
    }

    if (this.invoiceType === InvoiceType.Invoice) {
      const editInvoice: InvoiceModel = this.getTouchedEditedInvoice();
      this.invoicesStore.dispatch(invoicesActions.editInvoice({
        invoice: mapEditInvoiceModelToDto(editInvoice)
      }));
    }

    if (this.invoiceType === InvoiceType.Bill) {
      const hasAssetAccount = !!this.form.value.invoiceLines
        .find(item => item.account.accountType.parentType === 'Assets');

      const editBill: InvoiceModel = this.getTouchedEditedBill();
      this.invoicesStore.dispatch(invoicesActions.editInvoice({
        invoice: mapEditInvoiceModelToDto(editBill),
        hasAssetAccount
      }));
    }

    this.invoicesStore.select(invoicesSelectors.selectIsDataLoadedAfterAction)
      .pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res)),
        withLatestFrom(this.invoicesStore.select(
          invoicesSelectors.selectCurrentInvoice)
        )
      )
      .subscribe(([, invoice]: [any, InvoiceModel]) => {
        this.modalInvoiceService.setCurrentInvoice(touchInvoice(this.accounts, invoice));
        this.setTableData(this.currentInvoice.invoiceLines);
        this.markAsPaidOption = false;
        this.modalModeService.setModalMode(ModalMode.View);
      });
  }

  approveButtonClick(): void {
    this.invoicesStore.dispatch(invoicesActions.approveInvoice({
      id: this.currentInvoice.id
    }));
    this.invoicesStore.select(invoicesSelectors.selectIsDataLoadedAfterAction)
      .pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res)),
        withLatestFrom(this.invoicesStore.select(
          invoicesSelectors.selectCurrentInvoice)
        )
      )
      .subscribe(([, invoice]: [any, InvoiceModel]) => {
        this.modalInvoiceService.setCurrentInvoice(touchInvoice(this.accounts, invoice));
        this.setTableData(this.currentInvoice.invoiceLines);
        this.modalModeService.setModalMode(ModalMode.View);
      });
  }

  editButtonClick(): void {
    this.modalModeService.setModalMode(ModalMode.Edit);
  }

  cancelButtonClick(): void {
    if (this.modalMode === 'Add' || this.modalMode === 'View') {
      this.dialogRef.close();
    }

    if (this.modalMode === 'Edit') {
      this.resetCurrentModal();
      this.modalModeService.setModalMode(ModalMode.View);

      if (this.currentInvoice.status === 'Paid') {
        this.fillMarkAsPaidForm();
        this.invoiceStatus = this.currentInvoice.status;
        this.markAsPaidOption = false;
      }
    }
  }

  fillFormGroup(invoice: InvoiceModel, client: ClientModel): void {
    if (this.invoiceType === InvoiceType.Invoice) {
      this.form = this.fb.group({
        client: new FormControl(client ? client : '', [Validators.required]),
        billTo: new FormControl(invoice.billTo, [Validators.required]),
        details: new FormControl(invoice.details),
        invoiceDate: new FormControl(invoice.date || moment(), [Validators.required]),
        dueDate: new FormControl(invoice.dueDate || moment(), [Validators.required]),
        invoiceNumber: new FormControl(invoice.number, [Validators.required]),
        ref: new FormControl(invoice.ref),
        taxMode: new FormControl(
          this.taxRegistered
            ? invoice.taxMode || this.defaultTax
            : TaxMode.NoTax,
          [Validators.required]
        ),
        invoiceLines: new FormControl(invoice.invoiceLines, [Validators.required])
      });

      /** Dispatch Price Book if Client is selected */
      this.form.get('client').valueChanges
        .pipe(takeUntil(this.subscription$), filter(res => Boolean(res)))
        .subscribe((clientField: ClientModel | string) => {
          if (typeof clientField === 'object') {
            this.priceBookStore.dispatch(priceBookActions.clientPriceBook({ clientId: clientField.id }));
            this.clientStore.dispatch(clientsActions.clientById({ clientId: clientField.id }));
            this.cdr.detectChanges();
          }
        });
    }

    if (this.invoiceType === InvoiceType.Bill) {
      this.form = this.fb.group({
        party: new FormControl(invoice.party, [Validators.required]),
        details: new FormControl(invoice.details),
        invoiceDate: new FormControl(invoice.date || moment(), [Validators.required]),
        dueDate: new FormControl(invoice.dueDate),
        invoiceNumber: new FormControl(invoice.number),
        ref: new FormControl(invoice.ref),
        taxMode: new FormControl(
          this.taxRegistered
            ? invoice.taxMode || TaxMode.Inclusive
            : TaxMode.NoTax,
          [Validators.required]
        ),
        invoiceLines: new FormControl(invoice.invoiceLines, [Validators.required])
      });
    }

    if (!this.form.get('invoiceNumber').value && this.invoiceType === InvoiceType.Invoice) {
      this.setInvoiceNumberControl();
    }

    this.form.get('taxMode').valueChanges.pipe(takeUntil(this.subscription$)).subscribe((taxMode) => {
      const lines = this.form.get('invoiceLines').value;
      this.invoiceType === InvoiceType.Invoice
        ? this.calculateAmountFieldsForInvoice(lines, taxMode)
        : this.calculateAmountFieldsForBill(lines, taxMode);
    });

  }

  fillMarkAsPaidForm(): void {
    const currentInvoice: InvoiceModel = this.currentInvoice;
    const account = getAccountById(this.accounts, currentInvoice.paidIntoAccountId);
    this.formMarkAsPaid = this.fb.group({
      date: new FormControl(
        currentInvoice.status === 'Paid'
          ? currentInvoice.paidDate
          : null,
        [Validators.required]),
      cashAccount: new FormControl(
        currentInvoice.status === 'Paid' && account
          ? { displayName: account.name, value: account }
          : null,
        [Validators.required]
      )
    });
  }

  setTableData(invoiceLines: InvoiceLineModel[]): void {
    if (this.invoiceType === InvoiceType.Invoice) {
      if (this.taxRegistered) {
        this.tableColumns = ['remove', 'description', 'unitsString', 'quantity', 'rate', 'revenueAccounts', 'taxRate', 'invoiceAmount'];
        this.tableFormGroupRows$.next(
          invoiceLines.map((line: InvoiceLineModel) => this.fb.group({
            description: new FormControl(line.description),
            unitsString: new FormControl(line.unitsString, [Validators.required]),
            revenueAccounts: new FormControl(getAccountById(this.accounts, line.accountId), [Validators.required]),
            quantity: new FormControl(line.quantity, [Validators.required]),
            rate: new FormControl(line.rate, [Validators.required]),
            taxRate: new FormControl(line.taxRate, [Validators.required]),
            id: new FormControl(line.id)
          }))
        );
      } else {
        this.tableColumns = ['remove', 'description', 'unitsString', 'quantity', 'rate', 'revenueAccounts', 'invoiceAmount'];
        this.tableFormGroupRows$.next(
          invoiceLines.map((line: InvoiceLineModel) => this.fb.group({
            description: new FormControl(line.description),
            unitsString: new FormControl(line.unitsString, [Validators.required]),
            revenueAccounts: new FormControl(getAccountById(this.accounts, line.accountId), [Validators.required]),
            quantity: new FormControl(line.quantity, [Validators.required]),
            rate: new FormControl(line.rate, [Validators.required]),
            id: new FormControl(line.id)
          }))
        );
      }
    }

    if (this.invoiceType === InvoiceType.Bill) {
      if (this.taxRegistered) {
        this.tableColumns = ['remove', 'description', 'account', 'taxRate', 'amount'];
        this.tableFormGroupRows$.next(
          invoiceLines.map((line: InvoiceLineModel) => this.fb.group({
            description: new FormControl(line.description, [Validators.required]),
            account: new FormControl(getAccountById(this.accounts, line.accountId), [Validators.required]),
            taxRate: new FormControl(line.taxRate, [Validators.required]),
            amount: new FormControl(line.amount, [Validators.required]),
            id: new FormControl(line.id)
          }))
        );
      } else {
        this.tableColumns = ['remove', 'description', 'account', 'amount'];
        this.tableFormGroupRows$.next(
          invoiceLines.map((line: InvoiceLineModel) => this.fb.group({
            description: new FormControl(line.description, [Validators.required]),
            account: new FormControl(getAccountById(this.accounts, line.accountId), [Validators.required]),
            amount: new FormControl(line.amount, [Validators.required]),
            id: new FormControl(line.id)
          }))
        );
      }
    }
  }

  setInvoiceLines(event: FormArray): void {
    const lines = this.invoiceType === InvoiceType.Invoice
      ? event.value.map((line: InvoiceLineModel) => ({
        ...line,
        unitsString: typeof line.unitsString === 'string' ? line.unitsString : line.unitsString.unit
      }))
      : event.value;
    this.form.get('invoiceLines').patchValue(lines);

    const taxMode = this.getCurrentTaxMode();
    this.invoiceType === InvoiceType.Invoice
      ? this.calculateAmountFieldsForInvoice(lines, taxMode)
      : this.calculateAmountFieldsForBill(lines, taxMode);

    this.cdr.detectChanges();
  }

  getCurrentTaxMode(): TaxMode {
    return this.form.get('taxMode').value;
  }

  calculateAmountFieldsForInvoice(lines, taxMode): void {
    if (this.taxRegistered) {

      let total = 0;
      let tax = 0;
      lines.forEach((line) => {
        const lineAmount = Number(line.quantity) * Number(line.rate);
        total += lineAmount;

        if (taxMode === TaxMode.Inclusive && line.taxRate) {
          tax += lineAmount * this.gst;
        }

        if (taxMode === TaxMode.Exclusive) {
          tax += lineAmount * line.taxRate;
        }
      });

      this.subtotal = total;
      this.tax = tax;
      this.total = taxMode === TaxMode.Exclusive ? (total + tax) : total;
    } else {
      let total = 0;
      lines.value.forEach((line) => {
        const lineAmount = Number(line.quantity) * Number(line.rate);
        total += lineAmount;
      });
      this.total = total;
    }

    this.cdr.detectChanges();
  }

  calculateAmountFieldsForBill(lines, taxMode): void {
    if (this.taxRegistered) {

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
    } else {
      let total = 0;
      lines.value.forEach((line) => {
        total += Number(line.amount);
      });
      this.total = total;
    }

    this.cdr.detectChanges();
  }

  resetCurrentModal(): void {
    this.currentInvoice = this.modalInvoiceService.getCurrentInvoice();
    this.fillFormGroup(this.currentInvoice, this.getClientById(this.currentInvoice.clientId, this.clients));
    this.setTableData(this.currentInvoice.invoiceLines);
  }

  getTouchedInvoice(): InvoiceModel {
    const formData = this.form.value;
    const client = formData.client;
    const currentInvoice = this.currentInvoice;
    return {
      ...currentInvoice,
      party: typeof client === 'object' ? client.name : client,
      ref: formData.ref,
      type: InvoiceType.Invoice,
      date: formData.invoiceDate,
      taxMode: this.getCurrentTaxMode(),
      subtotal: this.subtotal,
      tax: this.tax,
      amount: this.total,
      details: formData.details,
      status: 'Draft',
      clientId: client.id,
      billTo: formData.billTo,
      number: formData.invoiceNumber,
      dueDate: formData.dueDate,
      invoiceLines: formData.invoiceLines.map((line, idx) => this.getTouchedInvoiceLines(line, idx, formData.invoiceDate))
    };
  }

  getTouchedBill(): InvoiceModel {
    const formData = this.form.value;
    const currentInvoice = this.currentInvoice;
    return {
      ...currentInvoice,
      party: formData.party,
      ref: formData.ref,
      type: InvoiceType.Bill,
      date: formData.invoiceDate,
      taxMode: this.getCurrentTaxMode(),
      subtotal: this.subtotal,
      tax: this.tax,
      amount: this.total,
      details: formData.details,
      status: 'Received',
      billTo: formData.billTo,
      number: formData.invoiceNumber,
      dueDate: formData.dueDate,
      invoiceLines: formData.invoiceLines
    };
  }

  getTouchedEditedInvoice(): InvoiceModel {
    const formData = this.form.value;
    const client = formData.client;
    const formMarkAsPaid = this.formMarkAsPaid ? this.formMarkAsPaid.value : null;
    const currentInvoice = this.currentInvoice;
    const status = currentInvoice.status === 'Draft' ? 'Draft' : 'Sent';
    return {
      ...currentInvoice,
      party: typeof client === 'object' ? client.name : client,
      ref: formData.ref,
      date: formData.invoiceDate,
      taxMode: this.getCurrentTaxMode(),
      subtotal: this.subtotal,
      tax: this.tax,
      amount: this.total,
      details: formData.details,
      clientId: client.id,
      billTo: formData.billTo,
      type: InvoiceType.Invoice,
      number: formData.invoiceNumber,
      dueDate: formData.dueDate ? formData.dueDate : null,
      invoiceLines: formData.invoiceLines.map((line, idx) => this.getTouchedInvoiceLines(line, idx, formData.invoiceDate)),
      paidDate: formMarkAsPaid?.date ? formMarkAsPaid.date : null,
      paidIntoAccountId: formMarkAsPaid?.cashAccount ? formMarkAsPaid.cashAccount.value.id : null,
      status: !formMarkAsPaid?.date || !formMarkAsPaid.cashAccount ? status : 'Paid'
    };
  }

  getTouchedEditedBill(): InvoiceModel {
    const formData = this.form.value;
    const formMarkAsPaid = this.formMarkAsPaid ? this.formMarkAsPaid.value : null;
    const currentInvoice = this.currentInvoice;
    return {
      ...currentInvoice,
      party: formData.party,
      ref: formData.ref,
      id: currentInvoice.id,
      date: formData.invoiceDate,
      taxMode: this.getCurrentTaxMode(),
      subtotal: this.subtotal,
      tax: this.tax,
      amount: this.total,
      details: formData.details,
      billTo: null,
      type: InvoiceType.Bill,
      number: formData.invoiceNumber ? formData.invoiceNumber : '',
      dueDate: formData.dueDate ? formData.dueDate : null,
      invoiceLines: formData.invoiceLines,
      paidDate: formMarkAsPaid?.date ? formMarkAsPaid.date : null,
      paidIntoAccountId: formMarkAsPaid?.cashAccount ? formMarkAsPaid.cashAccount.value.id : null,
      status: !formMarkAsPaid?.date || !formMarkAsPaid.cashAccount ? 'Received' : 'Paid'
    };
  }

  getTouchedInvoiceLines(line, idx: number, date): InvoiceLineModel {
    return {
      ...line,
      chargeIds: this.currentInvoice.invoiceLines[idx]?.chargeIds || [],
      account: line.revenueAccounts,
      date: moment(date).format('YYYY-MM-DD')
    };
  }

  isFormValid(): boolean {
    return this.form.valid && this.tableIsValid;
  }

  deleteButtonClick(): void {
    this.isDeleting$.next(true);
    this.invoiceActionService.deleteInvoice(this.currentInvoice.id, this.dialogRef);
  }

  markAsPaidButtonClick(): void {
    this.markAsPaidOption = true;
    this.fillMarkAsPaidForm();
  }

  savePaidButtonClick(): void {
    if (this.formMarkAsPaid.invalid) {
      return;
    }

    const formValue = this.formMarkAsPaid.value;
    const body = {
      PaidDate: moment(formValue.date).format('YYYY-MM-DD'),
      PaidIntoAccountId: formValue.cashAccount.value.id
    };
    this.invoicesStore.dispatch(invoicesActions.invoiceMarkAsPaid({
      id: this.currentInvoice.id,
      body
    }));
    this.invoicesStore.select(invoicesSelectors.selectIsDataLoadedAfterAction)
      .pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res)),
        withLatestFrom(this.invoicesStore.select(
          invoicesSelectors.selectCurrentInvoice)
        )
      )
      .subscribe(([, transaction]) => {
        this.modalInvoiceService.setCurrentInvoice(touchInvoice(this.accounts, transaction));
        this.setTableData(this.currentInvoice.invoiceLines);
        this.modalModeService.setModalMode(ModalMode.View);
        this.markAsPaidOption = false;
      });
  }

  addRowEvent(editableTable: EditableTableComponent): void {
    if (this.invoiceType === InvoiceType.Invoice) {
      editableTable.addInvoiceLineRow();
    }
    if (this.invoiceType === InvoiceType.Bill) {
      editableTable.addBillLineRow();
    }
  }

  discardPaidButtonClick(): void {
    this.markAsPaidOption = false;
    this.invoiceStatus = TransactionType.Invoice ? 'Sent' : 'Received';
    this.formMarkAsPaid.reset();
  }

  openClient(): void {
    const clientId = this.form.controls.client.value.id;

    this.clients$
      .pipe(filter(res => Boolean(res)), take(1))
      .subscribe(
        clients => {
          const clientModel = clients.find(client => client.id === clientId);
          this.dialogRef.close();
          this.clientActionsService.viewClient(clientModel);
        },
        error => {
          console.log(error);
          console.log('The clients with this Id did not found');
        }
      );
  }
}
