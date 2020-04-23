import { Action } from '@ngrx/store';

export enum CoreActionTypes {
  SetIsLoading = '[Core] Set IsLoading',
}

export class SetIsLoading implements Action {
  readonly type = CoreActionTypes.SetIsLoading;
  constructor(public payload: boolean) {}
}

export type CoreActions = SetIsLoading;
