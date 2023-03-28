import { Component, forwardRef, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BaseControlValueAccessor } from '../base-control-value-accessor';
import { validatorsPattern } from '../../../utils/validators/validator-pattern';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputComponent)
    }
  ]
})
export class InputComponent extends BaseControlValueAccessor<any> implements OnInit, OnDestroy {

  @Input() appAutoFocus: boolean;
  @Input() label: string;
  @Input() type: string;
  @Input() placeholder: string;
  @Input() borderOnlyOnFocus: boolean;
  @Input() isTableField: boolean;
  @Input() transparentBackground: boolean;
  @Input() isTextRight: boolean;
  @Input() maxLength: string;
  @Input() set disableState(isDisabled: boolean) {
    this.isView = isDisabled;
    this.setDisabledState(isDisabled);
  }

  /** Validation is true */
  @Input() hintSuccess: string;
  @Input() hintError: string;

  /** Validators */
  @Input() requiredValidator: boolean;
  @Input() emailValidator: boolean;
  @Input() minLengthValidator: number;
  @Input() mustMatchValidator: FormControl;

  @Output() isDirty = new EventEmitter<boolean>();

  isView = false;
  notRequired = true;

  subscription$ = new Subject();

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (
      this.requiredValidator ||
      this.emailValidator ||
      this.minLengthValidator ||
      this.mustMatchValidator
    ) {
      this.notRequired = false;
      this.setValidators();
    }
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  typeList(): boolean {
    const typeList = [
      'text',
      'password',
      'email',
      'number',
    ];
    return typeList.includes(this.type);
  }

  setValidators(): void {
    if (this.requiredValidator) {
      this.formControl.setValidators(Validators.required);
    }

    if (this.emailValidator) {
      this.formControl.setValidators([Validators.required, validatorsPattern.email]);
    }

    if (this.minLengthValidator) {
      this.formControl.setValidators([Validators.required, Validators.minLength(this.minLengthValidator)]);
    }

    if (this.mustMatchValidator) {
      this.formControl.setValidators(Validators.required);
      this.formControl.valueChanges.pipe(takeUntil(this.subscription$)).subscribe((value) => {
        if (this.mustMatchValidator.value !== value) {
          this.formControl.setErrors({ mustMatch: true });
        }
      });
    }
  }
}
