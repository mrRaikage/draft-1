import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AssetModel } from '../../core/interfaces/asset.interface';
import { getAccountById } from '../../shared/utils/functions/get-account-by-id.function';
import { combineLatest, Observable, Subject } from 'rxjs';
import { AccountModel } from '../../core/interfaces/account.interface';
import { filter, takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Action, ActionKey } from '../../shared/interfaces/actions.interface';
import { assetTableColumn } from '../../core/constants/asset.constants';
import { actionsList } from '../../shared/constants/actions.constants';

@Component({
  selector: 'app-asset-table',
  templateUrl: './asset-table.component.html',
  styleUrls: ['./asset-table.component.scss']
})
export class AssetTableComponent implements OnInit, OnDestroy {

  @Input() accounts$: Observable<AccountModel[]>;
  @Input() assetItems$: Observable<AssetModel[]>;
  @Input() dataLoaded: boolean;

  @Output() handleAction = new EventEmitter<[AssetModel, ActionKey | string]>();
  @Output() addFromBill = new EventEmitter();
  @Output() addFromCash = new EventEmitter();

  accounts: AccountModel[];

  dataSource = new MatTableDataSource<AssetModel>();

  columns: string[] = assetTableColumn;
  actions: Action[] = actionsList.filter((action: Action) => action.key !== ActionKey.View);
  filterValue = '';
  pageSize = 50;
  skeletonRows = new Array(9);

  subscription$ = new Subject();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  constructor() {
  }

  ngOnInit(): void {
    combineLatest([
      this.assetItems$.pipe(takeUntil(this.subscription$), filter(res => Boolean(res))),
      this.accounts$.pipe(takeUntil(this.subscription$), filter(res => Boolean(res)))
    ])
      .subscribe(([assetItems, accounts]: [AssetModel[], AccountModel[]]) => {
          this.accounts = accounts;
          this.dataSource.data = assetItems.reduce((acc, item) => {
            if (item.status === 'DRAFT') {
              return [item, ...acc];
            }
            return [...acc, item];
          }, []);
          this.dataSource.paginator = this.paginator;

          /** Set custom function to check data object with filter string */
          this.dataSource.filterPredicate = (data: AssetModel, filterName: string) => {
            return (
              data.categoryAccountId &&
              this.getCategoryNameById(data.categoryAccountId).toLowerCase().includes(filterName)) ||
              (data.name && data.name.toLowerCase().includes(filterName)) ||
              (data.status && data.status.toLowerCase().includes(filterName)) ||
              (data.identifier && data.identifier.toLowerCase().includes(filterName)) ||
              (data.dateAcquired && data.dateAcquired.toLowerCase().includes(filterName)) ||
              (data.bookValue && data.bookValue.toString().includes(filterName)
            );
          };
        }
      );
  }

  applyFilter($event: string): void {
    this.filterValue = $event;
    this.dataSource.filter = $event.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  getCategoryNameById(id: string): string {
    return getAccountById(this.accounts, id)?.name;
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

}
