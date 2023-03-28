import { Component, HostListener, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ModalConfirmData } from '../../interfaces/modal-confirm.interface';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent implements OnDestroy {

  subscription$ = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalConfirmData,
    public dialogRef: MatDialogRef<ModalConfirmComponent>
  ) {
    dialogRef.disableClose = true;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submit();
    }
    if (event.key === 'Escape') {
      this.cancel();
    }
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  submit(): void {
    this.data.action();
    this.data.actionSuccess$.pipe(takeUntil(this.subscription$), filter((res) => Boolean(res)))
      .subscribe(() => this.dialogRef.close(true));
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
