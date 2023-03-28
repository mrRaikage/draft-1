import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { bankFeedsTableColumn } from '../../core/constants/bank-feeds.constants';
import { BankFeedsModel } from '../../core/interfaces/bank-feeds.interface';
import { IBankFeedsState } from '../../core/store/bank-feeds/bank-feeds.reducer';
import * as bankFeedsSelectors from '../../core/store/bank-feeds/bank-feeds.selectors';
import * as bankFeedsActions from '../../core/store/bank-feeds/bank-feeds.actions';

@Component({
  selector: 'app-bank-feeds-table',
  templateUrl: './bank-feeds-table.component.html',
  styleUrls: ['./bank-feeds-table.component.scss']
})
export class BankFeedsTableComponent implements OnInit, OnDestroy {

  @Input() dataLoaded: boolean;
  @Input() bankFeedsItems$: Observable<BankFeedsModel[]>;

  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  subscription$ = new Subject();
  spinner$ = this.bankFeedsStore.select(bankFeedsSelectors.selectIsSpinnerStarted);
  columns: string[] = bankFeedsTableColumn;
  dataSource = new MatTableDataSource<BankFeedsModel>();
  file: File;
  pageSize = 50;

  constructor(private bankFeedsStore: Store<IBankFeedsState>) {
  }

  ngOnInit(): void {
    this.bankFeedsItems$.pipe(takeUntil(this.subscription$), filter(res => Boolean(res)))
      .subscribe((bankFeeds: BankFeedsModel[]) => {
        this.dataSource.data = bankFeeds;
      });
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  importFile(): void {
    const file = new FormData();
    file.append(this.file.name, this.file);

    this.bankFeedsStore.dispatch(bankFeedsActions.importBankFeeds({ file }));
  }
}
