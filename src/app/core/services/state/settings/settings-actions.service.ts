import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ModalConfirmComponent } from '../../../../shared/components/modal-confirm/modal-confirm.component';
import { ModalConfirmData, ModalConfirmType } from '../../../../shared/interfaces/modal-confirm.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsActionsService {

  constructor(private dialog: MatDialog) {}

  openConfirmExitDialog(): Promise<boolean> {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      height: '300px',
      width: '440px',
      autoFocus: false,
      data: {
        text: 'You have unsaved changes. Click cancel to save them',
        submitName: 'Discard',
        type: ModalConfirmType.DELETE,
        actionSuccess$: of(true),
        action: () => null
      } as ModalConfirmData
    });

    return dialogRef.afterClosed()
      .toPromise()
      .then(result => Promise.resolve(result));
  }

}
