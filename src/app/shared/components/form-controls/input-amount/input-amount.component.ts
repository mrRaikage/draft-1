import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import { BaseControlValueAccessor } from '../base-control-value-accessor';

@Component({
  selector: 'app-input-amount',
  templateUrl: './input-amount.component.html',
  styleUrls: ['./input-amount.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputAmountComponent)
    }
  ]
})
export class InputAmountComponent extends BaseControlValueAccessor<any> implements OnInit {

  @Input() label: string;
  @Input() placeholder: string;
  @Input() maxDigits: number;
  @Input() borderOnlyOnFocus: boolean;
  @Input() inputWidth: string;
  @Input() isTableField: boolean;
  @Input() transparentBackground: boolean;
  @Input() hiddenZeroValue: boolean;
  @Input() isTextRight: boolean;

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
