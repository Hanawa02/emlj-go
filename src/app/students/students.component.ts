import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { StudentsState } from '../store/students/students.reducer';
import { untilDestroy } from '@ngrx-utils/store';
import { tap, takeUntil } from 'rxjs/operators';
import { getAllStudents } from '../store/students/students.selectors';
import { LoadStudentsRequested } from '../store/students/students.actions';
import { Aluno } from '../rest-api';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'nome',
    'dataNascimento',
    'CPF',
    'telefone',
    'celular',
    'turmaAtual',
  ];
  filteredStudentList: Aluno[];
  studentList: Aluno[];

  searchParameter = new FormControl('');

  goToNovoAluno() {
    this.router.navigate(['novoAluno']);
  }

  constructor(private store: Store<StudentsState>, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadStudentsRequested());

    this.store
      .pipe(
        untilDestroy(this),
        select(getAllStudents),
        tap((students) => {
          this.studentList = students.slice();
          this.filterStudentList(this.searchParameter.value);
        })
      )
      .subscribe();

    this.searchParameter.valueChanges.subscribe((value) =>
      this.filterStudentList(value)
    );
  }

  filterStudentList(criteria: string) {
    criteria = criteria.toLowerCase();

    console.log(criteria, this.studentList, this.filteredStudentList);

    if (!this.studentList) {
      this.filteredStudentList = [];
      return;
    }

    if (!criteria) {
      this.filteredStudentList = this.studentList.slice();
      return;
    }

    this.filteredStudentList = this.studentList.filter(
      (student) =>
        student.nome?.toLowerCase().includes(criteria) ||
        student.CPF?.toString().includes(criteria)
    );
  }

  ngOnDestroy() {
    // Do not remove, needed for untilDestroy(this)
  }
}
