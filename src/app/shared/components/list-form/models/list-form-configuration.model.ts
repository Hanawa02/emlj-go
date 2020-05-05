import { ListFormColumn } from './list.form.column.model';
import { Type } from '@angular/core';

export class ListFormConfiguration {
  public displayedColumns: string[];

  constructor(
    public columns: ListFormColumn[],
    public allowEdit: boolean = true,
    public allowDelete: boolean = true
  ) {
    this.displayedColumns = this.columns.map((item) => item.propertyName);
    if (
      !this.displayedColumns.includes('options') &&
      (this.allowDelete || this.allowEdit)
    ) {
      this.displayedColumns.push('options');
    }
  }
}
