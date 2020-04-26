import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from, of, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
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
} from './auth.actions';
import { AuthService, DefaultService } from '../../rest-api';
import { Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import { LoadStudentsRequested } from '../students/students.actions';
import { SetIsLoading } from '../core/core.actions';

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
        catchError((error) => {
          // this.snackBar.open('Não foi possível realizar o login', 'ok', {
          //   duration: 5000,
          //   verticalPosition: 'top',
          // });

          return of(
            new LoginError({
              error,
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

      return forkJoin([
        from(Storage.set({ key: 'token', value: loginData.token })),
        from(Storage.set({ key: 'expiresAt', value: expiresAt.toString() })),
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
    switchMap(() => from(Storage.remove({ key: 'token' }))),
    tap(() => {
      this.router.navigate(['login']);
    })
  );

  @Effect({ dispatch: false })
  loginByToken$ = this.actions$.pipe(
    ofType<LoginByToken>(AuthActionTypes.LoginByToken),
    tap(() => {
      this.store.dispatch(new LoadStudentsRequested());

      if (this.router.url.includes('login')) {
        this.router.navigate(['alunos']);
      }
    })
  );

  wakeUpServer$ = this.actions$.pipe(
    ofType<WakeUpServer>(AuthActionTypes.WakeUpServer),
    tap(() => {
      this.defaultService.appControllerWakeUpServer();
    })
  );

  // @Effect()
  // UpdatePasswordRequested = this.actions$.pipe(
  //   ofType<UpdatePasswordRequested>(AuthActionTypes.UpdatePasswordRequested),
  //   map((action) => action.payload),
  //   mergeMap((payload) => {
  //     return this.accountService.accountUpdatepasswordPost(payload).pipe(
  //       map((response) => new UpdatePasswordSuccess()),
  //       catchError((error) => {
  //         this.snackBar.open(
  //           'não foi possível atualizar a senha',
  //           'OK',
  //           {
  //             duration: 5000,
  //             verticalPosition: 'top',
  //           }
  //         );

  //         return of(
  //           new UpdatePasswordError({
  //             error,
  //           })
  //         );
  //       })
  //     );
  //   })
  // );

  constructor(
    private authService: AuthService,
    private defaultService: DefaultService,
    private actions$: Actions,
    private router: Router,
    private store: Store<AuthState>
  ) {}
}
