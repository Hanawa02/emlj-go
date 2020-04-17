import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Aluno } from '../rest-api';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { StudentsState } from '../store/students/students.reducer';
import { Store, select } from '@ngrx/store';
import { LoadStudentsRequested } from '../store/students/students.actions';
import { untilDestroy } from '@ngrx-utils/store';
import { getAllStudents } from '../store/students/students.selectors';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Month } from '../shared/models/month.model';
import { Months, MonthSufix } from '../shared/constants/months.constant';

@Component({
  selector: 'app-birthday-person',
  templateUrl: './birthday-person.component.html',
  styleUrls: ['./birthday-person.component.scss'],
})
export class BirthdayPersonComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['nome', 'dataNascimento', 'turmaAtual'];
  dataSource = new MatTableDataSource<Aluno>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  month = new FormControl(new Date().getMonth());
  months: Month[] = Months;

  constructor(private store: Store<StudentsState>, private router: Router) {}

  ngOnInit(): void {
    this.dataSource.filterPredicate = this.birthMonthFilter;

    this.store
      .pipe(
        untilDestroy(this),
        select(getAllStudents),
        tap((students) => {
          this.dataSource.data = students;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.applyFilter(this.month.value);
        })
      )
      .subscribe();

    this.month.valueChanges.subscribe((value) => this.applyFilter(value));
  }

  applyFilter(value: string) {
    this.dataSource.filter = MonthSufix + value;
  }

  ngOnDestroy() {
    // Do not remove, needed for untilDestroy(this)
  }

  birthMonthFilter(data: Aluno, filter: string) {
    if (!data.dataNascimento) {
      return false;
    }
    const filterNumber = filter.replace(MonthSufix, '');
    const mes = +filterNumber;
    const aniversario = new Date(data.dataNascimento);

    return aniversario.getMonth() === mes;
  }
}
