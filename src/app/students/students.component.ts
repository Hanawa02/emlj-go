import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { StudentsState } from '../store/students/students.reducer';
import { untilDestroy } from '@ngrx-utils/store';
import { tap, takeUntil } from 'rxjs/operators';
import { getAllStudents } from '../store/students/students.selectors';
import { DeleteStudentRequested } from '../store/students/students.actions';
import { Aluno } from '../rest-api';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/components/dialogs/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from '../shared/components/dialogs/confirm-dialog/models/confirm-dialog-data.model';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'nome',
    'dataNascimento',
    'telefone',
    'celular',
    'turmaAtual',
    'options',
  ];
  dataSource = new MatTableDataSource<Aluno>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  searchParameter = new FormControl('');

  goToNovoAluno() {
    this.router.navigate(['novoAluno']);
  }

  constructor(
    private store: Store<StudentsState>,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: Aluno, filter: string) =>
      data.nome?.toLowerCase().includes(filter) ||
      data.CPF?.toString().includes(filter);

    this.store
      .pipe(
        untilDestroy(this),
        select(getAllStudents),
        tap((students) => {
          this.dataSource.data = students;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
      )
      .subscribe();

    this.searchParameter.valueChanges.subscribe((value) =>
      this.filterStudentList(value)
    );
  }

  filterStudentList(criteria: string) {
    this.dataSource.filter = criteria.toLowerCase();
  }

  ngOnDestroy() {
    // Do not remove, needed for untilDestroy(this)
  }

  edit(studentId: object) {
    this.router.navigate(['editarAluno', studentId.toString()]);
  }

  delete(student: Aluno) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogData(
        'Excluir Aluno',
        'Deseja confirmar a exclusão do aluno <strong>' +
          student.nome +
          '</strong>?'
      ),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          new DeleteStudentRequested({ studentId: student.id })
        );
      }
    });
  }
}
