import { Component } from '@angular/core';
import { startSurveySparrow } from '../../utils/functions/feedback.js';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-feedback',
  templateUrl: './modal-feedback.component.html',
  styleUrls: ['./modal-feedback.component.scss']
})
export class ModalFeedbackComponent {

  constructor(public dialogRef: MatDialogRef<ModalFeedbackComponent>) {
    dialogRef.disableClose = true;
    startSurveySparrow();
  }

}
