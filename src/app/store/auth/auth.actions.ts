import { Action } from '@ngrx/store';
import { User } from '../../auth/models/user';
import { User as LoginViewModel } from '../../rest-api';

export enum AuthActionTypes {
  LoginRequested = '[Auth] Login',
  LoginSuccess = '[API] Login Success',
  LoginError = '[API] Login Error',
  LoginByToken = '[Auth] Login By Token',
  Logout = '[Auth] Logout',

  UpdatePasswordRequested = '[Auth] Update Password Requested',
  UpdatePasswordSuccess = '[API] Update Password Success',
  UpdatePasswordError = '[API] Update Password Error',
}

export class LoginRequested implements Action {
  readonly type = AuthActionTypes.LoginRequested;
  constructor(public payload: { login: LoginViewModel }) {}
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LoginSuccess;
  constructor(public payload: { user: User; token: string }) {}
}

export class LoginError implements Action {
  readonly type = AuthActionTypes.LoginError;
  constructor(public payload: { error: any }) {}
}

export class LoginByToken implements Action {
  readonly type = AuthActionTypes.LoginByToken;
  constructor(public payload: { token: string }) {}
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
  constructor() {}
}

export class UpdatePasswordRequested implements Action {
  readonly type = AuthActionTypes.UpdatePasswordRequested;

  constructor(
    public payload: {
      email: string;
      oldPassword: string;
      newPassword: string;
    }
  ) {}
}

export class UpdatePasswordSuccess implements Action {
  readonly type = AuthActionTypes.UpdatePasswordSuccess;
}

export class UpdatePasswordError implements Action {
  readonly type = AuthActionTypes.UpdatePasswordError;

  constructor(
    public payload: {
      error: string;
    }
  ) {}
}

export type AuthActions =
  | LoginRequested
  | LoginSuccess
  | LoginError
  | LoginByToken
  | Logout
  | UpdatePasswordRequested
  | UpdatePasswordSuccess
  | UpdatePasswordError;
