import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { TransactionModel } from '../../core/interfaces/transaction.interface';

@Component({
  selector: 'app-mobile-invoices',
  templateUrl: './mobile-invoices.component.html',
  styleUrls: ['./mobile-invoices.component.scss']
})
export class MobileInvoicesComponent implements OnInit {

  @Input() transactions$: Observable<TransactionModel[]>;

  constructor() { }

  ngOnInit(): void {
  }

}
