import { ControlValueAccessor, FormControl } from '@angular/forms';

export class BaseControlValueAccessor<T> implements ControlValueAccessor {

  formControl: FormControl = new FormControl();
  onTouched: () => void = () => {};

  writeValue(v: any): void {
    this.formControl.setValue(v);
  }

  registerOnChange(fn: (v: any) => void): void {
    this.formControl.valueChanges.pipe().subscribe((val) => fn(val));
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled
      ? this.formControl.disable()
      : this.formControl.enable();
  }
}
