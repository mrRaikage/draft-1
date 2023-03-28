import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

import { ISelectListGroup } from '../../../interfaces/select-control.interface';
import { BaseControlValueAccessor } from '../base-control-value-accessor';

@Component({
  selector: 'app-select-opt-group-autocomplete',
  templateUrl: './select-opt-group-autocomplete.component.html',
  styleUrls: ['./select-opt-group-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectOptGroupAutocompleteComponent)
    }
  ]
})
export class SelectOptGroupAutocompleteComponent extends BaseControlValueAccessor<any> implements OnInit {

  @Input() set setList(list: ISelectListGroup<any[]>[]) {
    this.list = list;
    this.formControl.updateValueAndValidity();
  }

  @Input() placeholder: string;
  @Input() isTableField: boolean;
  @Input() label: string;

  @Input() set disableState(isDisabled: boolean) {
    this.isView = isDisabled;
    this.setDisabledState(isDisabled);
  }

  /** Validation */
  @Input() requiredValidator: boolean;
  @Input() selectObjectValidator: boolean;

  @Output() isDirty = new EventEmitter<boolean>();
  @Output() setError = new EventEmitter<boolean>();

  list: ISelectListGroup<any[]>[];
  isView = false;
  stateGroupOptions: Observable<ISelectListGroup<any[] | string>[]>;
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

    this.list = this.list?.filter(item => item.children.length);

    this.stateGroupOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (this.list) {
          if (typeof value === 'object' && value !== null) {
            value = value.name;
          }
          return this._filterGroup(value);
        }
      })
    );
  }

  displayProperty(value: any): boolean {
    if (value) {
      return typeof value === 'object' ? value.name : value;
    }
  }

  _filterGroup(value: string): ISelectListGroup<any[]>[] {
    if (value) {
      return this.list
        .map((group) => ({
          displayName: group.displayName,
          children: this.accountsFilter(group.children, value as string)
        }))
        .filter(group => group.children.length > 0);
    }

    return this.list;
  }

  accountsFilter = (opt: any[], value: string): any[] => {
    const filterValue = value.toString().toLowerCase();
    return opt.filter(item => item.name.toLowerCase().includes(filterValue));
  }

  checkValidControl(control: FormControl): void {
    if (this.selectObjectValidator) {
      const isError: boolean = typeof control.value === 'string';
      this.setError.emit(isError);
      this.formControl.setErrors(isError ? { incorrect: true } : null);
    }
  }

  checkCorrectValue(control: FormControl, event): void {
    if (this.selectObjectValidator) {
      if (typeof control.value === 'string' && !event?.relatedTarget?.classList.contains('mat-focus-indicator')) {
        this.formControl.setValue('');
      }
    }
  }

  onClear(triggerOnFocus, trigger, event: Event): void {
    this.formControl.reset();
    if (event) {
      event.stopPropagation();
    }
    trigger.openPanel();
    triggerOnFocus.focus();
  }

  pressTabButton(): void {
    const filteredList = this._filterGroup(this.formControl.value);
    if (!filteredList.length) {
      return;
    }

    filteredList[0].children[0] ?
      this.formControl.setValue(filteredList[0].children[0]) :
      this.formControl.setValue(filteredList[1].children[0]);
  }
}
