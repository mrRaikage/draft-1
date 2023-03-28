import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import { BaseControlValueAccessor } from '../base-control-value-accessor';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DatePickerComponent)
    }
  ]
})
export class DatePickerComponent extends BaseControlValueAccessor<any> implements OnInit {

  @Input() label: string;
  @Input() placeholder: string;
  @Input() class: string;
  @Input() borderOnlyOnFocus: boolean;
  @Input() isTextRight: boolean;
  @Input() isTableField: boolean;

  @Input() set disableState(isDisabled: boolean) {
    this.isView = isDisabled;
    this.setDisabledState(isDisabled);
  }

  /** Validation */
  @Input() requiredValidator: boolean;
  @Input() hintSuccess: string;
  @Input() hintError: string;

  @Output() isDirty = new EventEmitter<boolean>();

  isView = false;
  notRequired = true;

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.requiredValidator) {
      this.formControl.setValidators(Validators.required);
      this.notRequired = false;
    }
  }

}
