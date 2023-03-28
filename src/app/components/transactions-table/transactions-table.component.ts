import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';

import { TransactionModel } from '../../core/interfaces/transaction.interface';
import { nestedTableColumnsData, actionGroupedList, TransactionType } from '../../core/constants/transaction.constants';
import { Action, ActionKey } from '../../shared/interfaces/actions.interface';
import { GroupOfList } from '../../shared/components/button-drop-down/button-drop-down.component';
import { ITransactionsState } from '../../core/store/transactions/transactions.reducer';
import { selectIsCsvSpinnerStarted } from '../../core/store/transactions/transactions.selectors';
import { AccountModel } from '../../core/interfaces/account.interface';
import { touchTransaction } from '../../shared/utils/functions/touch-transaction.function';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { ModalImportTransactionsComponent } from '../modal-import-transactions/modal-import-transactions.component';
import { TransactionActionService } from '../../core/services/state/transactions/transaction-action.service';
import { emptyContentTransaction } from '../../core/constants/empty-content.constant';
import { EmptyContentModel } from '../../core/interfaces/empty-content.interface';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TransactionsTableComponent implements AfterViewInit, OnDestroy {
  @Input() transactionsData$: Observable<TransactionModel[]>;
  @Input() accounts$: Observable<AccountModel[]>;
  @Input() dataLoaded$: Observable<boolean>;
  @Input() actions: Action[];
  @Input() columnsData: { [key: string]: string };

  @Output() addTransaction = new EventEmitter();
  @Output() handleAction = new EventEmitter<[TransactionModel, ActionKey]>();
  @Output() exportToCsv = new EventEmitter();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  subscription$ = new Subject();
  spinner$: Observable<boolean> = this.transactionStore.select(selectIsCsvSpinnerStarted);

  dataSource = new MatTableDataSource<TransactionModel>();
  columns: string[];
  expandedElement: TransactionModel | null;

  nestedTableColumnsData: { [key: string]: string } = nestedTableColumnsData;
  actionGroupedList: GroupOfList[] = actionGroupedList;
  pageSize = 50;
  skeletonRows = new Array(9);
  filterValue = '';
  emptyContentTransaction: EmptyContentModel = emptyContentTransaction;

  constructor(
    private transactionStore: Store<ITransactionsState>,
    private dialog: MatDialog,
    private transactionActionService: TransactionActionService,
    public lSService: LocalStorageService
  ) {}

  ngAfterViewInit(): void {
    this.columns = Object.keys(this.columnsData);
    combineLatest([
      this.transactionsData$.pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res)),
        map((transactions: TransactionModel[]) =>
          transactions.filter((transaction: TransactionModel) => Boolean(transaction.invoice.status !== 'Draft'))
        )
      ),
      this.accounts$.pipe(takeUntil(this.subscription$), filter(res => Boolean(res)))
    ])
      .subscribe(([transitions, accounts]: [TransactionModel[], AccountModel[]]) => {
        this.dataSource.data = transitions.map((transaction: TransactionModel) => touchTransaction(accounts, transaction));
        this.dataSource.paginator = this.paginator;
      });

    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getColumnName(column: string): string {
    return this.columnsData[column];
  }

  importTransaction(): void {
    this.dialog.open(ModalImportTransactionsComponent, {
      width: '980px',
      height: '650px'
    });
  }

  rowClick(element: TransactionModel): void {
    element.type !== TransactionType.ManualLedger
      ? this.expandedElement = this.expandedElement === element ? null : element
      : this.transactionActionService.viewManualLedgers(element);
  }
}

