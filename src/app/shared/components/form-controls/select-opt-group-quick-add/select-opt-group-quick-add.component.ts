import {
  Component, ContentChild,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList, TemplateRef,
  ViewChild, ViewChildren
} from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';

import { SelectOptGroupAutocompleteComponent } from '../select-opt-group-autocomplete/select-opt-group-autocomplete.component';

@Component({
  selector: 'app-select-opt-group-quick-add',
  templateUrl: './select-opt-group-quick-add.component.html',
  styleUrls: ['./select-opt-group-quick-add.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectOptGroupQuickAddComponent)
    }
  ]
})
export class SelectOptGroupQuickAddComponent extends SelectOptGroupAutocompleteComponent implements OnInit, OnDestroy {

  panelOpened: boolean;
  subscription$ = new Subject();

  @Input() panelWidth: number;
  @Input() quickAddComponent: string;
  @Input() cursorPointer: boolean;

  @ContentChild('quickAddForm', { read: TemplateRef }) quickAddForm: TemplateRef<any>;
  @ViewChildren('content') content: QueryList<any>;
  @ViewChild('autoGroup') autoGroup: MatAutocomplete;
  @ViewChild('trigger') trigger: MatAutocompleteTrigger;

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
        if (this.list) {
          if (typeof value === 'object' && value !== null) {
            value = value.name;
          }
          return this._filterGroup(value);
        }
      })
    );
  }

  scrollOn(ev): void {
    this.autoGroup.panel.nativeElement.scrollTop += ev;
  }

  closePanel(): void {
    this.trigger.closePanel();
  }

  getControlValue(value): string {
    return value ? typeof value === 'object' ? value.name : value : '';
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
