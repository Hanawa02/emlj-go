import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  SimpleChanges,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { ListFormConfiguration } from './models/list-form-configuration.model';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ListFormComponent),
      multi: true,
    },
  ],
})
export class ListFormComponent
  implements OnInit, OnChanges, ControlValueAccessor {
  @Input() configuration: ListFormConfiguration;

  @Output() editItem: EventEmitter<any> = new EventEmitter();
  @Output() deleteItem: EventEmitter<any> = new EventEmitter();

  listValue = [];

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  isDisabled = false;
  onChange: any = () => {};
  onTouch: any = () => {};

  constructor() {}

  ngOnInit(): void {}

  set value(value: any) {
    if (!value) return;
    this.listValue = value;
    this.dataSource.data = value;

    this.onChange(this.listValue);
    this.onTouch(this.listValue);
  }

  get value(): any {
    return this.listValue;
  }

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
