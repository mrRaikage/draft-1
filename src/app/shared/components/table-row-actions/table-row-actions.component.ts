import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { Action, ActionKey } from '../../interfaces/actions.interface';

@Component({
  selector: 'app-table-row-actions',
  templateUrl: './table-row-actions.component.html',
  styleUrls: ['./table-row-actions.component.scss']
})
export class TableRowActionsComponent implements OnInit {

  @Input() actions: Action[];
  @Output() handleAction = new EventEmitter<ActionKey>();

  constructor() {}

  ngOnInit(): void {}

}
