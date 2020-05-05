import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from, of, forkJoin } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  tap,
  take,
} from 'rxjs/operators';
import {
  AuthActionTypes,
  LoginError,
  LoginRequested,
  LoginSuccess,
  Logout,
  UpdatePasswordRequested,
  UpdatePasswordSuccess,
  UpdatePasswordError,
  LoginByToken,
  WakeUpServer,
  LoginByTokenSuccess,
} from './auth.actions';
import { AuthService, DefaultService } from '../../rest-api';
import { Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import { LoadStudentsRequested } from '../students/students.actions';
import { SetIsLoading } from '../core/core.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

const { Storage } = Plugins;

@Injectable()
export class AuthEffects {
  @Effect()
  loginRequested$ = this.actions$.pipe(
    ofType<LoginRequested>(AuthActionTypes.LoginRequested),
    map((action) => action.payload.login),
    switchMap((login) => {
      this.store.dispatch(new SetIsLoading(true));
      return this.authService.authControllerLogin(login).pipe(
        map((data) => {
          return new LoginSuccess({
            loginData: data,
          });
        }),
        catchError((httpError) => {
          this.store.dispatch(new SetIsLoading(false));
          const message = httpError?.error?.message
            ? httpError.error.message
            : '';

          this.snackbar.open(
            'Não foi possível realizar o login! ' + message,
            'ok',
            {
              duration: 5000,
              verticalPosition: 'top',
            }
          );

          return of(
            new LoginError({
              error: httpError.error,
            })
          );
        })
      );
    })
  );

  @Effect({ dispatch: false })
  loginSuccess$ = this.actions$.pipe(
    ofType<LoginSuccess>(AuthActionTypes.LoginSuccess),
    map((action) => action.payload.loginData),
    switchMap((loginData) => {
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + loginData.expiresIn);

      this.setSessionExpirationTimeout(loginData.expiresIn * 1000);
      const authData = {
        token: loginData.token,
        expiresAt: expiresAt.toString(),
        email: loginData.user.email,
        username: loginData.user.username,
      };
      return forkJoin([
        from(Storage.set({ key: 'authData', value: JSON.stringify(authData) })),
      ]);
    }),
    tap(() => {
      this.store.dispatch(new LoadStudentsRequested());
      this.router.navigate(['alunos']);
    })
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType<Logout>(AuthActionTypes.Logout),
    map(() => from(Storage.remove({ key: 'authData' }))),
    tap(() => {
      this.router.navigate(['login']);
    })
  );

  @Effect()
  loginByToken$ = this.actions$.pipe(
    ofType<LoginByToken>(AuthActionTypes.LoginByToken),
    map((action) => action.payload),
    map((payload) => {
      const token = payload.token;
      const expiresAt = payload.expiresAt;

      if (!token || !expiresAt) {
        return new Logout();
      }

      const now = new Date().getTime();
      const expiresAtTime = new Date(expiresAt).getTime();
      const expiresIn = expiresAtTime - now;

      if (expiresIn <= 0) {
        return new Logout();
      }

      this.setSessionExpirationTimeout(expiresIn);

      return new LoginByTokenSuccess({
        user: { email: payload.email, username: payload.username },
      });
    })
  );

  @Effect()
  loginByTokenSuccess$ = this.actions$.pipe(
    ofType<LoginByTokenSuccess>(AuthActionTypes.LoginByTokenSuccess),
    map(() => {
      if (this.router.url.includes('login')) {
        this.router.navigate(['alunos']);
      }
      return new LoadStudentsRequested();
    })
  );

  @Effect({ dispatch: false })
  wakeUpServer$ = this.actions$.pipe(
    ofType<WakeUpServer>(AuthActionTypes.WakeUpServer),
    tap(() => {
      this.defaultService.appControllerWakeUpServer().pipe(take(1)).subscribe();
    })
  );

  @Effect()
  UpdatePasswordRequested = this.actions$.pipe(
    ofType<UpdatePasswordRequested>(AuthActionTypes.UpdatePasswordRequested),
    map((action) => action.payload),
    mergeMap((payload) => {
      this.store.dispatch(new SetIsLoading(true));
      return this.authService.authControllerUpdatePassword(payload).pipe(
        map((response) => {
          this.store.dispatch(new SetIsLoading(false));
          this.snackbar.open('Senha atualizada com sucesso!', 'ok', {
            duration: 5000,
            verticalPosition: 'top',
          });
          return new UpdatePasswordSuccess();
        }),
        catchError((httpError) => {
          this.store.dispatch(new SetIsLoading(false));
          const message = httpError?.error?.message
            ? httpError.error.message
            : '';

          this.snackbar.open(
            'Não foi possível atualizar a senha! ' + message,
            'ok',
            {
              duration: 5000,
              verticalPosition: 'top',
            }
          );

          return of(
            new LoginError({
              error: httpError.error,
            })
          );
        })
      );
    })
  );

  setSessionExpirationTimeout(timeInMiliseconds) {
    setInterval(() => this.sessionExpired(), timeInMiliseconds);
  }

  sessionExpired() {
    this.snackbar.open('Sessão expirada', 'OK', {
      duration: 4000,
      verticalPosition: 'top',
    });

    this.store.dispatch(new Logout());
  }
  constructor(
    private authService: AuthService,
    private defaultService: DefaultService,
    private actions$: Actions,
    private router: Router,
    private store: Store<AuthState>,
    private snackbar: MatSnackBar
  ) {}
}
