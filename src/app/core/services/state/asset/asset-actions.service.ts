import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ModalModeService } from '../../../../shared/services/modal-mode.service';
import { ModalMode } from '../../../constants/transaction.constants';
import { ModalAssetComponent } from '../../../../components/modal-asset/modal-asset.component';
import { AssetModel } from '../../../interfaces/asset.interface';
import { ModalAssetService } from './modal-asset.service';


@Injectable({
  providedIn: 'root'
})
export class AssetActionsService {

  constructor(
    private dialog: MatDialog,
    private modalAssetService: ModalAssetService,
    private modalModeService: ModalModeService
  ) { }

  viewAsset(assetTrx: AssetModel): void {
    this.modalModeService.setModalMode(ModalMode.View);
    this.modalAssetService.setCurrentTransactionAsset(assetTrx);
    this.openAssetModal();
  }

  editAsset(assetTrx: AssetModel): void {
    this.modalModeService.setModalMode(ModalMode.Edit);
    this.modalAssetService.setCurrentTransactionAsset(assetTrx);
    this.openAssetModal();
  }

  openAssetModal(): void {
    this.dialog.open(ModalAssetComponent, {
      width: '980px',
      height: 'auto',
      position: { top: '80px' }
    });
  }
}
