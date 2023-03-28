import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalModeService } from '../../shared/services/modal-mode.service';

@Component({
  selector: 'app-modal-asset',
  templateUrl: './modal-asset.component.html',
  styleUrls: ['./modal-asset.component.scss']
})
export class ModalAssetComponent implements OnInit {

  activeTab = 0;

  constructor(
    public dialogRef: MatDialogRef<ModalAssetComponent>,
    public modalModeService: ModalModeService
  ) {}

  ngOnInit(): void {}
}
