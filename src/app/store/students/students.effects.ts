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
} from './students.actions';
import { Action } from 'rxjs/internal/scheduler/Action';
import { DefaultService, AlunosService } from '../../rest-api';

const { Storage } = Plugins;

@Injectable()
export class StudentsEffects {
  @Effect()
  loadStudentsRequest$ = this.actions$.pipe(
    ofType<LoadStudentsRequested>(StudentsActionTypes.LoadStudents),
    switchMap(() =>
      this.studentService.alunosControllerFindAll().pipe(
        map((data) => {
          return new LoadStudentsSuccess({
            students: data,
          });
        }),
        catchError((error) => {
          // this.snackBar.open('Não foi possível realizar o login', 'ok', {
          //   duration: 5000,
          //   verticalPosition: 'top',
          // });

          return of(
            new LoadStudentsError({
              error,
            })
          );
        })
      )
    )
  );

  @Effect()
  createStudentRequest$ = this.actions$.pipe(
    ofType<CreateStudentRequested>(StudentsActionTypes.CreateStudent),
    map((action) => action.payload.student),
    switchMap((student) =>
      this.studentService.alunosControllerCreate(student).pipe(
        map((data) => {
          return new CreateStudentSuccess({
            student: data,
          });
        }),
        catchError((error) => {
          // this.snackBar.open('Não foi possível realizar o login', 'ok', {
          //   duration: 5000,
          //   verticalPosition: 'top',
          // });

          return of(
            new CreateStudentError({
              error,
            })
          );
        })
      )
    )
  );
  constructor(
    private studentService: AlunosService,
    private actions$: Actions,
    private router: Router
  ) {}
}
