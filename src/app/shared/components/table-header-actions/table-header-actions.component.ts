import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { GroupOfList } from '../button-drop-down/button-drop-down.component';

@Component({
  selector: 'app-table-header-actions',
  templateUrl: './table-header-actions.component.html',
  styleUrls: ['./table-header-actions.component.scss']
})
export class TableHeaderActionsComponent implements OnInit {

  @Input() addButtonName: string;
  @Input() actionGroupedList: GroupOfList[];
  @Input() dataLoaded: boolean;
  @Input() addButtonType: string;
  /** drop-down | add */
  @Input() exportToCsvButton = false;
  @Input() importTransaction = false;
  @Input() spinner: boolean;
  @Input() hasSearchFilter = true;
  @Input() filterValue: string;
  @Input() assetHeader: boolean;

  @Output() applyFilter = new EventEmitter<string>();
  @Output() handleAction = new EventEmitter();
  @Output() exportToCsv = new EventEmitter();
  @Output() handleImportTransaction = new EventEmitter();
  @Output() addFromBill = new EventEmitter();
  @Output() addFromCash = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
