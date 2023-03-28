import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray } from '@angular/forms';
import { EmptyContentModel } from '../../../core/interfaces/empty-content.interface';

@Component({
  selector: 'app-empty-content',
  templateUrl: './empty-content.component.html',
  styleUrls: ['./empty-content.component.scss']
})

export class EmptyContentComponent implements OnInit {
  @Input('emptyContentData') data: EmptyContentModel;

  @Output() addLineButtonClick = new EventEmitter<FormArray>();
  @Output() showHiddenButtonClick = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onClick(btnTitle: string): any {
    btnTitle === 'View invoiced items'
      ? this.showHiddenButtonClick.emit()
      : this.addLineButtonClick.emit();
  }
}
