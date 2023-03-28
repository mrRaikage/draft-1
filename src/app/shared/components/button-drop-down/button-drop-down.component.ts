import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

export interface GroupOfList {
  displayName: string;
  children: {
    key: string;
    displayName: string;
  }[];
}

@Component({
  selector: 'app-button-drop-down',
  templateUrl: './button-drop-down.component.html',
  styleUrls: ['./button-drop-down.component.scss']
})
export class ButtonDropDownComponent implements OnInit {

  @Input() label: string;
  @Input() groups: GroupOfList[];

  @Output() handleAction = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

}
