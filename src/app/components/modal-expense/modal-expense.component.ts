import { AfterViewInit, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

import { ModalModeService } from '../../shared/services/modal-mode.service';
import { ModalTransactionData } from '../../core/interfaces/transaction.interface';
import { ModalTransactionService } from '../../core/services/state/transactions/modal-transaction.service';

@Component({
  selector: 'app-modal-expense',
  templateUrl: './modal-expense.component.html',
  styleUrls: ['./modal-expense.component.scss']
})
export class ModalExpenseComponent implements AfterViewInit {

  activeTab = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalTransactionData,
    public dialogRef: MatDialogRef<ModalExpenseComponent>,
    public modalTransactionService: ModalTransactionService,
    public modalModeService: ModalModeService,
    private cdr: ChangeDetectorRef
  ) {
    dialogRef.disableClose = true;
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  tabChanged($event: MatTabChangeEvent): void {
    this.activeTab = $event.index;
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
