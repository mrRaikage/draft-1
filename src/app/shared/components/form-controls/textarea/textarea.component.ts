import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { BaseControlValueAccessor } from '../base-control-value-accessor';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TextareaComponent)
    }
  ]
})
export class TextareaComponent extends BaseControlValueAccessor<any> implements OnInit {

  @Input() label: string;
  @Input() placeholder: string;
  @Input() borderOnlyOnFocus: boolean;
  @Input() style: string;
  @Input() maxLength: string;

  @Input() set disableState(isDisabled: boolean) {
    this.isView = isDisabled;
    this.setDisabledState(isDisabled);
  }

  /** Validators */
  @Input() requiredValidator: boolean;

  /** Validation is true */
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
