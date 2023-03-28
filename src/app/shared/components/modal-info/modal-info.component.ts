import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ModalInfoInterface } from '../../interfaces/modal-info.interface';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss']
})
export class ModalInfoComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalInfoInterface,
    public dialogRef: MatDialogRef<ModalInfoComponent>
  ) {
    dialogRef.disableClose = true;
  }

}
