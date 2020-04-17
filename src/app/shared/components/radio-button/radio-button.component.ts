import {
  Component,
  OnInit,
  Input,
  forwardRef,
  SimpleChanges,
  SimpleChange,
  OnChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioButtonItem } from './models/radio-button-item.model';
import { DefaultRadioButtonList } from './constants/default-radio-button-list.constant';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true,
    },
  ],
})
export class RadioButtonComponent
  implements OnInit, OnChanges, ControlValueAccessor {
  @Input() label: string;
  @Input() values: RadioButtonItem[] = DefaultRadioButtonList;

  selectedValue: any;

  isDisabled = false;
  onChange: any = () => {};
  onTouch: any = () => {};

  set value(value: any) {
    this.selectedValue = value;

    this.onChange(this.selectedValue);
    this.onTouch(this.selectedValue);
  }

  get value(): any {
    return this.selectedValue;
  }

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentValue === this.value) {
      return;
    }
    this.value = changes.currentValue;
  }

  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(onChangeFunction: any): void {
    this.onChange = onChangeFunction;
  }
  registerOnTouched(onTouchedFunction: any): void {
    this.onTouch = onTouchedFunction;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
