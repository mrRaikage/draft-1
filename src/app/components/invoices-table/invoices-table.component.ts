import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { filter, takeUntil } from 'rxjs/operators';

import { ClientModel } from '../../core/interfaces/clients.interface';
import { Action, ActionKey } from '../../shared/interfaces/actions.interface';
import { emptyInvoice, invoicesTableColumn } from '../../core/constants/invoice.constants';
import { AccountModel } from '../../core/interfaces/account.interface';
import { touchInvoice } from '../../shared/utils/functions/touch-transaction.function';
import { actionsList } from '../../shared/constants/actions.constants';
import { InvoiceModel } from '../../core/interfaces/invoice.interface';


@Component({
  selector: 'app-invoices-table',
  templateUrl: './invoices-table.component.html',
  styleUrls: ['./invoices-table.component.scss']
})
export class InvoicesTableComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() invoices$: Observable<InvoiceModel[]>;
  @Input() accounts$: Observable<AccountModel[]>;
  @Input() clients$: Observable<ClientModel[]>;
  @Input() dataLoaded$: Observable<boolean>;

  @Output() createInvoice = new EventEmitter();
  @Output() handleAction = new EventEmitter<[InvoiceModel, ActionKey | string]>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  subscription$ = new Subject();

  dataLoaded: boolean;

  clients: ClientModel[];
  dataSource = new MatTableDataSource<InvoiceModel>();
  actions: Action[] = actionsList.filter((action: Action) => action.key !== ActionKey.View);
  columns: string[] = invoicesTableColumn;
  pageSize = 50;
  filterValue = '';
  skeletonRows = new Array(9);

  constructor() {
  }

  ngOnInit(): void {
    this.dataLoaded$.pipe(takeUntil(this.subscription$))
      .subscribe((res: boolean) => {
        this.dataLoaded = res;
        if (!res) {
          this.dataSource.data = Array(9).fill(emptyInvoice);
        }
      });

    combineLatest([
      this.invoices$.pipe(takeUntil(this.subscription$), filter(res => Boolean(res))),
      this.accounts$.pipe(takeUntil(this.subscription$), filter(res => Boolean(res))),
      this.clients$.pipe(takeUntil(this.subscription$), filter(res => Boolean(res)))
    ])
      .subscribe(([invoices, accounts, clients]: [InvoiceModel[], AccountModel[], ClientModel[]]) => {
        this.clients = clients;

        this.dataSource.data = invoices
          .map((invoice: InvoiceModel) => touchInvoice(accounts, invoice));
        this.dataSource.paginator = this.paginator;

        /** Set custom function to check data object with filter string */
        this.dataSource.filterPredicate = (data: InvoiceModel, filterName: string) => {
          return (data.details && data.details.toLowerCase().includes(filterName)) ||
            (data.number && data.number.toLowerCase().includes(filterName)) ||
            (data.party && data.party.toLowerCase().includes(filterName)) ||
            (data.status && data.status.toLowerCase().includes(filterName)) ||
            (data.billTo && data.billTo.toLowerCase().includes(filterName));
        };
      });
  }

  ngAfterViewInit(): void {
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

  getClientNameById(id: string): string {
    const client = this.clients.find(c => c.id === id);
    return client?.name;
  }

}
