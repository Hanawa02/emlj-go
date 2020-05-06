import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { StudentsState } from '../store/students/students.reducer';
import {
  getAllActiveStudents,
  getPendingRents,
} from '../store/students/students.selectors';
import { MatTableDataSource } from '@angular/material/table';
import { Rent } from '../shared/models/rent.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { tap } from 'rxjs/operators';
import { untilDestroy } from '@ngrx-utils/store';
import { MatDatepicker } from '@angular/material/datepicker';
import { AddRent } from '../store/students/students.actions';

@Component({
  selector: 'app-rents',
  templateUrl: './rents.component.html',
  styleUrls: ['./rents.component.scss'],
})
export class RentsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'studentName',
    'rentDate',
    'rentItem',
    'comment',
    'options',
  ];

  rentForm: FormGroup;

  students$ = this.store.select(getAllActiveStudents);

  dataSource = new MatTableDataSource<Rent>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('rentDatePicker')
  rentDatePicker: MatDatepicker<Date>;

  constructor(
    private store: Store<StudentsState>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.rentForm = this.formBuilder.group({
      studentId: ['', [Validators.required]],
      rentItem: ['', [Validators.required]],
      rentDate: ['', []],
      comment: ['', []],
    });

    this.store
      .pipe(
        untilDestroy(this),
        select(getPendingRents),
        tap((rents) => {
          this.dataSource.data = rents;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
      )
      .subscribe();
  }

  save() {
    this.store.dispatch(new AddRent({ rent: this.rentForm.value }));
    this.rentForm.reset();
  }

  markAsReturned(rent) {
    console.log(rent);
  }

  openRentDatePicker() {
    this.rentDatePicker.open();
  }

  ngOnDestroy() {
    // do not remove this, necessary for untilDestroy(this)
  }
}
