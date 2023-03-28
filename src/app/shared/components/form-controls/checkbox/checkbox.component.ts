import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { BaseControlValueAccessor } from '../base-control-value-accessor';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CheckboxComponent)
    }
  ]
})
export class CheckboxComponent extends BaseControlValueAccessor<any> {

  @Input() indeterminate: boolean;
  @Input() checked: boolean;
  @Input() label: string;
  @Input() ariaLabel: string;
  @Input() labelPosition: string;
  @Input() isTextRight: string;
  @Input() blackLabel: boolean;

  @Input() set disableState(isDisabled: boolean) {
    this.setDisabledState(isDisabled);
  }
  @Output() checkboxChange = new EventEmitter();

  constructor() {
    super();
  }

  onChange($event: MatCheckboxChange): void {
    this.checkboxChange.emit($event);
  }
}
