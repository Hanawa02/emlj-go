import { Action } from '@ngrx/store';
import { Aluno } from 'src/app/rest-api';

export enum StudentsActionTypes {
  LoadStudents = '[Students] Load Students',
  LoadStudentsSuccess = '[API] Load Students Success',
  LoadStudentsError = '[API] Load Students Error',

  CreateStudent = '[Student] Create Student',
  CreateStudentSuccess = '[API] Create Student Success',
  CreateStudentError = '[API] Create Student Error',

  UpdateStudent = '[Student] Update Student',
  UpdateStudentSuccess = '[API] Update Student Success',
  UpdateStudentError = '[API] Update Student Error',

  DeleteStudent = '[Student] Delete Student',
  DeleteStudentSuccess = '[API] Delete Student Success',
  DeleteStudentError = '[API] Delete Student Error',
}

export class LoadStudentsRequested implements Action {
  readonly type = StudentsActionTypes.LoadStudents;
  constructor() {}
}

export class LoadStudentsSuccess implements Action {
  readonly type = StudentsActionTypes.LoadStudentsSuccess;
  constructor(public payload: { students: Aluno[] }) {}
}

export class LoadStudentsError implements Action {
  readonly type = StudentsActionTypes.LoadStudentsError;
  constructor(public payload: { error: string }) {}
}

export class CreateStudentRequested implements Action {
  readonly type = StudentsActionTypes.CreateStudent;
  constructor(public payload: { student: Aluno }) {}
}

export class CreateStudentSuccess implements Action {
  readonly type = StudentsActionTypes.CreateStudentSuccess;
  constructor(public payload: { student: Aluno }) {}
}

export class CreateStudentError implements Action {
  readonly type = StudentsActionTypes.CreateStudentError;
  constructor(public payload: { error: string }) {}
}

export class UpdateStudentRequested implements Action {
  readonly type = StudentsActionTypes.UpdateStudent;
  constructor(public payload: { student: Partial<Aluno> }) {}
}

export class UpdateStudentSuccess implements Action {
  readonly type = StudentsActionTypes.UpdateStudentSuccess;
  constructor(public payload: { student: Aluno }) {}
}

export class UpdateStudentError implements Action {
  readonly type = StudentsActionTypes.UpdateStudentError;
  constructor(public payload: { error: string }) {}
}

export class DeleteStudentRequested implements Action {
  readonly type = StudentsActionTypes.DeleteStudent;
  constructor(public payload: { studentId: string }) {}
}

export class DeleteStudentSuccess implements Action {
  readonly type = StudentsActionTypes.DeleteStudentSuccess;
  constructor() {}
}

export class DeleteStudentError implements Action {
  readonly type = StudentsActionTypes.DeleteStudentError;
  constructor(public payload: { error: string }) {}
}

export type StudentsActions =
  | LoadStudentsRequested
  | LoadStudentsSuccess
  | LoadStudentsError
  | CreateStudentRequested
  | CreateStudentSuccess
  | CreateStudentError
  | UpdateStudentRequested
  | UpdateStudentSuccess
  | UpdateStudentError
  | DeleteStudentRequested
  | DeleteStudentSuccess
  | DeleteStudentError;
