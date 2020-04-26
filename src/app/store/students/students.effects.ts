import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
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
} from './students.actions';
import { Action } from 'rxjs/internal/scheduler/Action';
import { AlunosService } from '../../rest-api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { StudentsState } from './students.reducer';
import { SetIsLoading } from '../core/core.actions';

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
            return new UpdateStudentSuccess({
              student,
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

  constructor(
    private studentService: AlunosService,
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private store: Store<StudentsState>,
    private router: Router
  ) {}
}
