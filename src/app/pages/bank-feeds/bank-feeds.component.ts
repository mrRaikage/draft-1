import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { IBankFeedsState } from '../../core/store/bank-feeds/bank-feeds.reducer';
import * as bankFeedsSelectors from '../../core/store/bank-feeds/bank-feeds.selectors';

@Component({
  selector: 'app-bank-feeds',
  templateUrl: './bank-feeds.component.html',
  styleUrls: ['./bank-feeds.component.scss']
})
export class BankFeedsComponent implements OnInit {

  dataLoaded$ = this.bankFeedsStore.select(bankFeedsSelectors.selectIsDataLoaded);
  bankFeedsItems$ = this.bankFeedsStore.select(bankFeedsSelectors.selectBankFeedsData);

  constructor(
    private bankFeedsStore: Store<IBankFeedsState>
  ) {}

  ngOnInit(): void {}

}
