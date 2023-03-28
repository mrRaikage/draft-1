import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { TransactionModel } from '../../core/interfaces/transaction.interface';

@Component({
  selector: 'app-mobile-transactions-list',
  templateUrl: './mobile-transactions-list.component.html',
  styleUrls: ['./mobile-transactions-list.component.scss']
})
export class MobileTransactionsListComponent implements OnInit {

  @Input() transactions$: Observable<TransactionModel[]>;

  constructor() {}

  ngOnInit(): void {}

  applyFilter($event: KeyboardEvent): void {}
}
