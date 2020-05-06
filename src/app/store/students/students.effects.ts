import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  StudentsActionTypes,
  LoadStudentsRequested,
  LoadStudentsSuccess,
  LoadStudentsError,
  CreateStudentRequested,
  CreateStudentSuccess,
  CreateStudentError,
  DeleteStudentRequested,
  DeleteStudentSuccess,
  DeleteStudentError,
  UpdateStudentRequested,
  UpdateStudentSuccess,
  UpdateStudentError,
  AddRent,
} from './students.actions';
import { AlunosService, Emprestimo, Aluno } from '../../rest-api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store, select } from '@ngrx/store';
import { StudentsState } from './students.reducer';
import { SetIsLoading } from '../core/core.actions';
import { getStudentsEntities } from './students.selectors';

@Injectable()
export class StudentsEffects {
  @Effect()
  loadStudentsRequest$ = this.actions$.pipe(
    ofType<LoadStudentsRequested>(StudentsActionTypes.LoadStudents),
    switchMap(() => {
      this.store.dispatch(new SetIsLoading(true));
      return this.studentService.alunosControllerFindAll().pipe(
        map((data) => {
          this.store.dispatch(new SetIsLoading(false));
          return new LoadStudentsSuccess({
            students: data,
          });
        }),
        catchError((error) => {
          this.store.dispatch(new SetIsLoading(false));
          this.snackBar.open('Não foi possível carregar os alunos', 'ok', {
            duration: 5000,
            verticalPosition: 'top',
          });
          console.log(error);
          // this.snackBar.open(JSON.stringify(error), 'ok', {
          //   duration: 5000,
          //   verticalPosition: 'top',
          // });

          return of(
            new LoadStudentsError({
              error,
            })
          );
        })
      );
    })
  );

  @Effect()
  createStudentRequest$ = this.actions$.pipe(
    ofType<CreateStudentRequested>(StudentsActionTypes.CreateStudent),
    map((action) => action.payload.student),
    switchMap((student) => {
      this.store.dispatch(new SetIsLoading(true));
      return this.studentService.alunosControllerCreate(student).pipe(
        map((data) => {
          this.store.dispatch(new SetIsLoading(false));
          this.snackBar.open('Aluno criado com sucesso', 'ok', {
            duration: 5000,
            verticalPosition: 'top',
          });
          this.router.navigate(['editarAluno', data.id.toString()]);
          return new CreateStudentSuccess({
            student: data,
          });
        }),
        catchError((error) => {
          this.store.dispatch(new SetIsLoading(false));
          this.snackBar.open('Não foi possível criar o aluno', 'ok', {
            duration: 5000,
            verticalPosition: 'top',
          });
          console.log(error);
          // this.snackBar.open(JSON.stringify(error), 'ok', {
          //   duration: 5000,
          //   verticalPosition: 'top',
          // });
          return of(
            new CreateStudentError({
              error,
            })
          );
        })
      );
    })
  );

  @Effect()
  deleteStudentRequest$ = this.actions$.pipe(
    ofType<DeleteStudentRequested>(StudentsActionTypes.DeleteStudent),
    map((action) => action.payload.studentId),
    switchMap((studentId) => {
      this.store.dispatch(new SetIsLoading(true));
      return this.studentService.alunosControllerRemove(studentId).pipe(
        map((data) => {
          this.store.dispatch(new SetIsLoading(false));
          this.snackBar.open('Aluno excluído com sucesso', 'ok', {
            duration: 5000,
            verticalPosition: 'top',
          });
          return new DeleteStudentSuccess({
            studentId,
          });
        }),
        catchError((error) => {
          this.store.dispatch(new SetIsLoading(false));
          this.snackBar.open('Não foi possível excluir o aluno', 'ok', {
            duration: 5000,
            verticalPosition: 'top',
          });
          console.log(error);
          // this.snackBar.open(JSON.stringify(error), 'ok', {
          //   duration: 5000,
          //   verticalPosition: 'top',
          // });
          return of(
            new DeleteStudentError({
              error,
            })
          );
        })
      );
    })
  );

  @Effect()
  updateStudentRequest$ = this.actions$.pipe(
    ofType<UpdateStudentRequested>(StudentsActionTypes.UpdateStudent),
    map((action) => action.payload.student),
    switchMap((student) => {
      this.store.dispatch(new SetIsLoading(true));
      return this.studentService
        .alunosControllerUpdate(student.id, student)
        .pipe(
          map((data) => {
            this.store.dispatch(new SetIsLoading(false));
            this.snackBar.open('Aluno atualizado com sucesso', 'ok', {
              duration: 5000,
              verticalPosition: 'top',
            });
            console.log(data);
            return new UpdateStudentSuccess({
              student: data,
            });
          }),
          catchError((error) => {
            this.store.dispatch(new SetIsLoading(false));
            this.snackBar.open('Não foi possível atualizar o aluno', 'ok', {
              duration: 5000,
              verticalPosition: 'top',
            });
            console.log(error);
            // this.snackBar.open(JSON.stringify(error), 'ok', {
            //   duration: 5000,
            //   verticalPosition: 'top',
            // });
            return of(
              new UpdateStudentError({
                error,
              })
            );
          })
        );
    })
  );

  @Effect()
  addRent$ = this.actions$.pipe(
    ofType<AddRent>(StudentsActionTypes.AddRent),
    map((action) => action.payload.rent),
    withLatestFrom(this.store.pipe(select(getStudentsEntities))),
    switchMap(([rent, studentsEntities]) => {
      const student: Aluno = { ...studentsEntities[rent.studentId] };
      const rentDate = rent.rentDate ? rent.rentDate : new Date();

      const rents = student.emprestimos ? [...student.emprestimos] : [];
      const emprestimo: Emprestimo = {
        dataEmprestimo: rentDate.toString(),
        titulo: rent.rentItem,
        observacao: rent.comment,
      };
      rents.push(emprestimo);

      student.emprestimos = rents;

      return of(new UpdateStudentRequested({ student }));
    })
  );

  constructor(
    private studentService: AlunosService,
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private store: Store<StudentsState>,
    private router: Router
  ) {}
}
