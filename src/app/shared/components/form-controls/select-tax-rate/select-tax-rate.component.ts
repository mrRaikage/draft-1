import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import { BaseControlValueAccessor } from '../base-control-value-accessor';
import { TaxMode } from '../../../../core/constants/transaction.constants';

@Component({
  selector: 'app-select-tax-rate',
  templateUrl: './select-tax-rate.component.html',
  styleUrls: ['./select-tax-rate.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectTaxRateComponent)
    }
  ]
})
export class SelectTaxRateComponent extends BaseControlValueAccessor<number> implements OnInit {

  @Input() placeholder: string;
  @Input() label: string;
  @Input() panelClass: string;

  @Input() set setTaxMode(taxMode: TaxMode) {
    this.taxMode = taxMode;
    if (this.taxMode === TaxMode.NoTax) {
      this.formControl.setValue(0);
      this.setDisabledState(true);
    } else {
      if (this.formControl.disabled) {
        this.setDisabledState(false);
      }
    }
  }

  @Input() set disableState(isDisabled: boolean) {
    this.isView = isDisabled;
    this.setDisabledState(isDisabled);
  }

  /** Validation */
  @Input() requiredValidator: boolean;

  @Output() isDirty = new EventEmitter<boolean>();

  taxMode: TaxMode;
  isView = false;
  notRequired = true;

  list = [
    {
      value: 0.15,
      displayName: '15%'
    },
    {
      value: 0,
      displayName: 'Tax Exempt'
    }
  ];

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
