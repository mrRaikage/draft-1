import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

import { ActionKey } from '../../shared/interfaces/actions.interface';
import { AssetModel } from '../../core/interfaces/asset.interface';
import { AssetActionsService } from '../../core/services/state/asset/asset-actions.service';
import { IAssetState } from '../../core/store/asset/asset.reducer';
import * as assetSelectors from '../../core/store/asset/asset.selectors';
import { TransactionModel } from '../../core/interfaces/transaction.interface';
import * as accountsSelectors from '../../core/store/accounts/accounts.selectors';
import { IAccountsState } from '../../core/store/accounts/accounts.reducer';
import { TransactionActionService } from '../../core/services/state/transactions/transaction-action.service';
import { emptyContentAssets } from '../../core/constants/empty-content.constant';
import { EmptyContentModel } from '../../core/interfaces/empty-content.interface';


@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})
export class AssetComponent implements OnInit {

  emptyContentAssets: EmptyContentModel = emptyContentAssets;

  dataLoaded$ = this.assetStore.select(assetSelectors.selectIsDataLoaded);
  accounts$ = this.accountsStore.select(accountsSelectors.selectAccountsData);
  assetItems$ = this.assetStore.select(assetSelectors.selectAssetData)
    .pipe(filter((transactions: TransactionModel[]) => Boolean(transactions)));

  constructor(
    private assetStore: Store<IAssetState>,
    private accountsStore: Store<IAccountsState>,
    private transactionActions: TransactionActionService,
    private assetActions: AssetActionsService
  ) { }

  addFromTransaction(transactionType: string): void {
    this.transactionActions.addTransaction(transactionType);
  }

  ngOnInit(): void {
  }

  handleAction([assetTrx, key]: [AssetModel, ActionKey | string]): void {
    switch (key) {
      case ActionKey.View: this.assetActions.viewAsset(assetTrx); break;
      case ActionKey.Edit: this.assetActions.editAsset(assetTrx); break;
      default: return;
    }
  }

}
