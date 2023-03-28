import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { ModalModeService } from '../../shared/services/modal-mode.service';

@Component({
  selector: 'app-modal-clients',
  templateUrl: './modal-clients.component.html',
  styleUrls: ['./modal-clients.component.scss']
})
export class ModalClientsComponent implements OnInit {

  currentTabIndex = 0;

  constructor(
    public dialogRef: MatDialogRef<ModalClientsComponent>,
    public modalModeService: ModalModeService
  ) {}

  ngOnInit(): void {}

}
