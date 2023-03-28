import { AfterViewInit, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

import { ModalTransactionData } from '../../core/interfaces/transaction.interface';
import { ModalModeService } from '../../shared/services/modal-mode.service';
import { ModalTransactionService } from '../../core/services/state/transactions/modal-transaction.service';

@Component({
  selector: 'app-modal-transaction',
  templateUrl: './modal-transaction.component.html',
  styleUrls: ['./modal-transaction.component.scss'],
})
export class ModalTransactionComponent implements AfterViewInit {

  activeTab = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalTransactionData,
    public dialogRef: MatDialogRef<ModalTransactionComponent>,
    public modalTransactionService: ModalTransactionService,
    public modalModeService: ModalModeService,
    private cdr: ChangeDetectorRef
  ) {
    dialogRef.disableClose = true;
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  public tabChanged($event: MatTabChangeEvent): void {
    this.activeTab = $event.index;
  }
}
