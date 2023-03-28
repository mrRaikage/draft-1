import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { BaseControlValueAccessor } from '../base-control-value-accessor';
import { ISelectListGroup } from '../../../interfaces/select-control.interface';

@Component({
  selector: 'app-select-multi-with-search',
  templateUrl: './select-multi-with-search.component.html',
  styleUrls: ['./select-multi-with-search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectMultiWithSearchComponent)
    }
  ]
})
export class SelectMultiWithSearchComponent extends BaseControlValueAccessor<SelectMultiWithSearchComponent> implements OnInit {
  selectData: Array<any> = [];
  allData: Array<any> = [];
  stateGroupOptions: Observable<ISelectListGroup<any[] | string>[]>;
  list: any;
  selectControl = new FormControl();
  isView = false;
  notRequired = true;

  @Input() set setList(list: any) {
    this.list = list;
    this.allData = this.list.map(value => value.children).flat();
    this.initList();
  }
  @Input() placeholder = 'Select Data';
  @Input() key = '';
  @Input() label: string;
  @Input() requiredValidator: boolean;

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.requiredValidator) {
      this.notRequired = false;
    }
  }

  initList(): void {
    this.formControl.valueChanges.subscribe(res => {
      this.selectData = res;
    });

    this.list.forEach((item: any) => {
      item.children.forEach((data: any) => {
        if (data.selected === true) {
          this.selectData.push(data);
        }
      });
    });

    this.stateGroupOptions = this.selectControl.valueChanges.pipe(
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

  displayFn = (): string => '';

  optionClicked = (event: Event, data: any): void => {
    event.stopPropagation();
    this.toggleSelection(data);
  }

  toggleSelection = (data: any): void => {
    const element = this.selectData?.find(elem => elem.id === data.id);
    const index = this.selectData?.indexOf(element);
    if (!!element) {
      this.selectData.splice(index, 1);
    } else {
      this.selectData.push(data);
    }
    this.formControl.setValue(this.selectData);
  }

  toggleSelectAll(): void {
    if (this.selectData.length === this.allData.length) {
      this.selectData = [];
    } else {
      this.selectData = this.allData;
    }
    this.formControl.setValue(this.selectData);
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

  accountsFilter = (group: any[], value: string): any[] => {
    const filterValue = value.toString().toLowerCase();
    return group.filter(item => item.name.toLowerCase().includes(filterValue));
  }

  isChecked(item): boolean {
    return !!this.selectData?.find(elem => elem.id === item.id);
  }

  isAllSelected(): boolean {
    return this.selectData.length === this.allData.length;
  }
}
