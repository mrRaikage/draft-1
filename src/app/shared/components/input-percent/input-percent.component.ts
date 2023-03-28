import { Component, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-percent',
  templateUrl: './input-percent.component.html',
  styleUrls: ['./input-percent.component.scss']
})
export class InputPercentComponent {
  // tslint:disable-next-line:variable-name
  _v: number;

  get data(): number {
    return this._v;
  }

  @Input() set data(v) {
    this._v = v;
    this.cdr.detectChanges();
    if (v > 100) {
      v = 100;
    } else if (v < 0) {
      v = 0;
    }
    this._v = v;
    this.valueChange.emit(v);
  }

  @Input() label: string;

  @Output() valueChange = new EventEmitter<number>();
  @Output() isDirty = new EventEmitter<boolean>();

  constructor(private cdr: ChangeDetectorRef) {}

}
