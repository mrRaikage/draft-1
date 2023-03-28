import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ModalModeService } from '../../shared/services/modal-mode.service';

@Component({
  selector: 'app-modal-ledger',
  templateUrl: './modal-ledger.component.html',
  styleUrls: ['./modal-ledger.component.scss']
})
export class ModalLedgerComponent implements OnInit {

  activeTab = 0;


  constructor(
    public dialogRef: MatDialogRef<ModalLedgerComponent>,
    public modalModeService: ModalModeService
  ) { }

  ngOnInit(): void {
  }

  tabChanged($event: MatTabChangeEvent): void {
    this.activeTab = $event.index;
  }
}
