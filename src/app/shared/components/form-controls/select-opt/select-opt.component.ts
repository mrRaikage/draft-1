import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import { BaseControlValueAccessor } from '../base-control-value-accessor';
import { ISelectListItem } from '../../../interfaces/select-control.interface';

@Component({
  selector: 'app-select-opt',
  templateUrl: './select-opt.component.html',
  styleUrls: ['./select-opt.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectOptComponent)
    }
  ]
})
export class SelectOptComponent extends BaseControlValueAccessor<any> implements OnInit {

  @Input() label: string;
  @Input() placeholder: string;
  @Input() list: ISelectListItem<any>[];
  @Input() panelClass: ISelectListItem<any>[];
  @Input() mode: string;
  @Input() isTableField: boolean;
  @Input() isTextRight: string;

  @Input() set disableState(isDisabled: boolean) {
    this.isView = isDisabled;
    this.setDisabledState(isDisabled);
  }

  /** Validation */
  @Input() requiredValidator: boolean;

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
