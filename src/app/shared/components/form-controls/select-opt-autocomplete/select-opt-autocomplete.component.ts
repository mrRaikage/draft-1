import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { ISelectListItem } from '../../../interfaces/select-control.interface';
import { BaseControlValueAccessor } from '../base-control-value-accessor';

@Component({
  selector: 'app-select-opt-autocomplete',
  templateUrl: './select-opt-autocomplete.component.html',
  styleUrls: ['./select-opt-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectOptAutocompleteComponent)
    }
  ]
})
export class SelectOptAutocompleteComponent extends BaseControlValueAccessor<any> implements OnInit {

  @Input() label: string;
  @Input() list: ISelectListItem<any>[];
  @Input() placeholder: string;
  @Input() isTableField: boolean;
  @Input() panelWidth: number;
  @Input() transparentBackground: boolean;
  @Input() type: string;

  @Input() set disableState(isDisabled: boolean) {
    this.isView = isDisabled;
    this.setDisabledState(isDisabled);
  }

  /** Validators */
  @Input() requiredValidator: boolean;
  @Input() selectObjectValidator: boolean;

  @Output() isDirty = new EventEmitter<boolean>();
  @Output() setError = new EventEmitter<boolean>();

  @ViewChild('triggerOnFocus', { read: MatAutocompleteTrigger }) autoTrigger: MatAutocompleteTrigger;

  isView = false;
  stateGroupOptions: Observable<ISelectListItem<any>[]>;
  notRequired = true;

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.requiredValidator || this.selectObjectValidator) {
      this.notRequired = false;
    }

    if (this.requiredValidator) {
      this.formControl.setValidators(Validators.required);
    }

    this.stateGroupOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'object' && value !== null) {
          value = value.name;
        }
        return this._filterGroup(value);
      })
    );
  }

  public displayProperty(value: any): string {
    if (value) {
      return value.displayName;
    }
  }

  private _filterGroup(value: string): ISelectListItem<any>[] {
    if (value) {
      return this.accountsFilter(this.list, value as string);
    }

    return this.list;
  }

  accountsFilter = (opt: any[], value: string): any[] => {
    const filterValue = value.toLowerCase();
    return opt.filter(item => item.value.name.toLowerCase().includes(filterValue));
  };

  checkValidControl(control: FormControl): void {
    if (this.selectObjectValidator) {
      const isError: boolean = typeof control.value === 'string';
      this.setError.emit(isError);
      this.formControl.setErrors(isError ? { incorrect: true } : null);
    }
  }

  checkCorrectValue(control: FormControl, event): void {
    if (this.selectObjectValidator) {
      if (typeof control.value === 'string' && !event.relatedTarget.classList.contains('mat-focus-indicator')) {
        this.autoTrigger.closePanel();
        this.formControl.setValue('');
      }
    }
  }

  onClear(triggerOnFocus, trigger, event: Event): void {
    this.formControl.reset();
    event.stopPropagation();
    trigger.openPanel();
    triggerOnFocus.focus();
  }

  pressTabButton(): void {
    let value = this.formControl.value;

    if (typeof value === 'object' && value !== null) {
      value = value.name;
    }

    const filteredList = this._filterGroup(value);

    if (!filteredList.length) {
      return;
    }

    this.formControl.setValue(filteredList[0]);
  }
}
