import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AssetModel } from '../../../interfaces/asset.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalAssetService {

  private currentTransactionAssetSubject: BehaviorSubject<AssetModel> = new BehaviorSubject<AssetModel>(null);
  public currentTransactionAsset$: Observable<AssetModel> = this.currentTransactionAssetSubject.asObservable();

  constructor() { }

  setCurrentTransactionAsset(assetTrx: AssetModel): void {
    this.currentTransactionAssetSubject.next(assetTrx);
  }

  getCurrentTransactionAsset(): AssetModel {
    return this.currentTransactionAssetSubject.value;
  }

}
