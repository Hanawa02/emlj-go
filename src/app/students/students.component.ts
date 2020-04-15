import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { StudentsState } from '../store/students/students.reducer';
import { untilDestroy } from '@ngrx-utils/store';
import { tap } from 'rxjs/operators';
import { getAllStudents } from '../store/students/students.selectors';
import { LoadStudentsRequested } from '../store/students/students.actions';
import { Aluno } from '../rest-api';
import { Router } from '@angular/router';

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
  dataSource$ = this.store.pipe(select(getAllStudents));

  goToNovoAluno() {
    this.router.navigate(['novoAluno']);
  }

  constructor(private store: Store<StudentsState>, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadStudentsRequested());
  }

  ngOnDestroy() {
    // Do not remove, needed for untilDestroy(this)
  }
}
