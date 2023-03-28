import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

import { ModalModeService } from '../../shared/services/modal-mode.service';

@Component({
  selector: 'app-modal-job',
  templateUrl: './modal-job.component.html',
  styleUrls: ['./modal-job.component.scss']
})
export class ModalJobComponent implements OnInit {

  activeTab = 0;

  constructor(
    public dialogRef: MatDialogRef<ModalJobComponent>,
    public modalModeService: ModalModeService
  ) {}

  ngOnInit(): void {}

  tabChanged($event: MatTabChangeEvent): void {
    this.activeTab = $event.index;
  }
}
