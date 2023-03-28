import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { InvoiceModel } from '../../core/interfaces/invoice.interface';
import { ModalJobComponent } from '../modal-job/modal-job.component';
import { IJobsState } from '../../core/store/job/job.reducer';
import { TransactionModel } from '../../core/interfaces/transaction.interface';
import { InvoiceActionsService } from '../../core/services/state/invoices/invoice-actions.service';
import { ModalModeService } from '../../shared/services/modal-mode.service';
import { ISelectListGroup } from '../../shared/interfaces/select-control.interface';
import { IClientsState } from '../../core/store/clients/clients.reducer';
import { EditableTableComponent } from '../../shared/components/editable-table/editable-table.component';
import { IPriceBookState } from '../../core/store/prce-book/price-book.reducer';
import { PriceBookItemModel } from '../../core/interfaces/price-book.interface';
import { chargeGroups } from '../../core/constants/job.constants';
import * as jobActions from '../../core/store/job/job.actions';
import * as jobSelectors from '../../core/store/job/job.selectors';
import * as priceBookActions from '../../core/store/prce-book/price-book.actions';
import * as priceBookSelectors from '../../core/store/prce-book/price-book.selectors';
import { ChargeModel, EditChargeDto, JobModel } from '../../core/interfaces/job.interface';
import { InvoiceType, ModalMode } from '../../core/constants/transaction.constants';
import { ModalJobService } from '../../core/services/state/job/modal-job.service';
import { emptyContentCharges, hiddenRowCharges } from '../../core/constants/empty-content.constant';
import { EmptyContentModel } from '../../core/interfaces/empty-content.interface';

@Component({
  selector: 'app-charges-tab',
  templateUrl: './charges-tab.component.html',
  styleUrls: ['./charges-tab.component.scss']
})
export class ChargesTabComponent implements OnInit, OnDestroy {

  currentChargeList: ChargeModel[];
  isChargesLoading$: Observable<boolean> = this.jobStore.select(jobSelectors.selectIsChargesLoading);
  currentJob: JobModel;
  tableColumns: string[];
  emptyContentCharges: EmptyContentModel = emptyContentCharges;
  hiddenRowCharges: EmptyContentModel = hiddenRowCharges;
  createNewChargeButtonClicked = false;

  chargeGroups = Object.values(chargeGroups);
  chargeGroupValue = 'None';

  formControl: FormControl = this.fb.control(null);
  checkboxControl: FormControl = this.fb.control(false);
  total = 0;

  linesIsTouched: boolean;

  showInvoiced$ = new BehaviorSubject(false);

  get showInvoiced(): boolean {
    return this.showInvoiced$.value;
  }

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

  subscription$ = new Subject();
  tableFormGroupRows$ = new BehaviorSubject<FormGroup[]>(null);
  spinnerStarted$ = this.jobStore.select(jobSelectors.selectSpinner);
  isSelection$ = new BehaviorSubject(false);

  @ViewChild('editableTable') editableTable: EditableTableComponent;

  get modalMode(): ModalMode {
    return this.modalModeService.getModalMode();
  }

  setShowInvoiced(value: boolean): void {
    this.showInvoiced$.next(value);
  }

  constructor(
    public dialogRef: MatDialogRef<ModalJobComponent>,
    public modalJobService: ModalJobService,
    private fb: FormBuilder,
    private jobStore: Store<IJobsState>,
    private invoiceActionService: InvoiceActionsService,
    private modalModeService: ModalModeService,
    private clientStore: Store<IClientsState>,
    private priceBookStore: Store<IPriceBookState>,
    private cdr: ChangeDetectorRef
  ) {

    /** Get Current Job */
    this.modalJobService.currentJob$
      .pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res))
      )
      .subscribe((currentJob: JobModel) => {
        this.currentJob = currentJob;
        this.jobStore.dispatch(jobActions.chargesData({ jobId: this.currentJob.id }));

        /** Dispatch Price Book Action */
        this.priceBookStore.dispatch(priceBookActions.orgPriceBook());

        if (currentJob.clientId) {
          this.priceBookStore.dispatch(priceBookActions.clientPriceBook({ clientId: currentJob.clientId }));
        }
      });

    /** Get Charges */
    this.jobStore.select(jobSelectors.selectListOfCharges)
      .pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res))
      )
      .subscribe((currentChargeList: ChargeModel[]) => {
        this.currentChargeList = currentChargeList;
        this.setTableData();
      });
  }

  ngOnInit(): void {
    this.isSelection$.pipe(takeUntil(this.subscription$)).subscribe(isSelection => {
      if (this.tableColumns) {
        if (isSelection) {
          this.tableColumns.splice(1, 0, 'select');
        } else {
          const index = this.tableColumns.indexOf('select');
          if (index > -1) {
            this.tableColumns.splice(index, 1);
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  setTableData(): void {
    this.tableFormGroupRows$.next(this.fillLinesGroups(this.currentChargeList));
    this.tableColumns = ['remove', 'status', 'date', 'description', 'unitsString', 'rate', 'quantity', 'invoiceAmount'];
  }

  createInvoiceButtonClick(rows: FormGroup[]): void {
    if (!rows.length) {
      return;
    }
    const chargesIds: string[] = rows.map((row: FormGroup) => row.value.id);
    this.jobStore.dispatch(jobActions.createJobInvoice({
      jobId: this.currentJob.id,
      groupBy: this.chargeGroupValue,
      chargesIds
    }));

    this.jobStore.select(jobSelectors.selectIsDataLoadedAfterAction)
      .pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res)),
        withLatestFrom(
          this.jobStore.select(jobSelectors.selectJobInvoice)
        )
      )
      .subscribe(([, jobInvoice]: [boolean, TransactionModel]) => {
        const createInvoice: InvoiceModel = {
          ...jobInvoice.invoice,
          jobId: this.currentJob.id,
          ref: this.currentJob.reference,
          invoiceLines: jobInvoice.invoice.invoiceLines
        };
        this.dialogRef.close();
        this.invoiceActionService.createInvoice(InvoiceType.Invoice, createInvoice);
      });

  }

  saveButtonClick(): void {
    if (this.formControl.invalid) {
      return;
    }
    const invoiced: ChargeModel[] = !this.showInvoiced
      ? this.currentChargeList.filter(item => item.status === 'Invoiced')
      : [];

    const formControlData: any[] = [...this.formControl.value, ...invoiced];
    const editedCharges: EditChargeDto[] = formControlData.map(item => ({
      ...item,
      date: moment(item.date).format('YYYY-MM-DD'),
      amount: Number(item.quantity) * Number(item.rate)
    }));

    this.jobStore.dispatch(jobActions.editChargesData({
      jobId: this.currentJob.id,
      editedCharges
    }));

    this.jobStore.select(jobSelectors.selectIsDataLoadedAfterAction)
      .pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res)),
        withLatestFrom(
          this.jobStore.select(jobSelectors.selectListOfCharges)
        )
      )
      .subscribe(([, chargeList]: [any, ChargeModel[]]) => {
        this.currentChargeList = chargeList;
        this.setTableData();
        this.modalModeService.setModalMode(ModalMode.View);
      });
  }

  editButtonClick(): void {
    this.modalModeService.setModalMode(ModalMode.Edit);
  }

  cancelButtonClick(): void {
    if (this.createNewChargeButtonClicked) {
      this.modalModeService.setModalMode(ModalMode.View);
      this.setTableData();
      this.checkboxControl.setValue(false);
      this.createNewChargeButtonClicked = false;
      return;
    }

    if (this.isSelection$.value) {
      this.isSelection$.next(false);
      this.editableTable.selection.clear();
      return;
    }

    if (this.modalMode === 'Add' || this.modalMode === 'View') {
      this.dialogRef.close();
    }

    if (this.modalMode === 'Edit') {
      this.modalModeService.setModalMode(ModalMode.View);
      this.setTableData();
    }
  }

  fillLinesGroups(rows: ChargeModel[]): FormGroup[] {
    return rows.map((row: ChargeModel) => {
      return this.fb.group({
        status: new FormControl(row.status || 'Pending', [Validators.required]),
        date: new FormControl(row.date, [Validators.required]),
        description: new FormControl(row.description, [Validators.required]),
        unitsString: new FormControl(row.unitsString, [Validators.required]),
        rate: new FormControl(row.rate, [Validators.required]),
        quantity: new FormControl(row.quantity, [Validators.required]),
        id: new FormControl(row.id)
      });
    });
  }

  setLines(event: FormArray): void {
    const lines = event.value.map((line: ChargeModel, idx: number) => {
      const priceBookId = typeof line.unitsString === 'string' ? null : line.unitsString.id;
      const currentPriceBookId = this.currentChargeList[idx]?.priceBookItemId;
      return {
        ...line,
        unitsString: typeof line.unitsString === 'string' ? line.unitsString : line.unitsString.unit,
        priceBookItemId: currentPriceBookId ? currentPriceBookId : priceBookId
      };
    });
    this.formControl.patchValue(lines);
    this.calculateTotal(lines);
    this.cdr.detectChanges();
  }

  calculateTotal(lines: ChargeModel[]): void {
    let total = 0;
    lines.forEach((line: ChargeModel) => {
      total += Number(line.quantity) * Number(line.rate);
    });
    this.total = total;
  }

  setLinesErrors($event: boolean): void {
    this.formControl.setErrors($event ? null : { emptyFields: true });
  }

  selectChargesButtonClick(): void {
    this.isSelection$.next(true);
  }

  createNewChargeButtonClick(editableTable: EditableTableComponent): void {
    this.createNewChargeButtonClicked = true;
    this.editButtonClick();
    this.checkboxControl.setValue(true);
    editableTable.addChargeLineRow();
  }
}
