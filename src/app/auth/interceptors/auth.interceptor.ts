import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Store } from '@ngrx/store';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthState } from 'src/app/store/auth/auth.reducer';
import { Logout } from 'src/app/store/auth/auth.actions';

const { Storage } = Plugins;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private store: Store<AuthState>) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return from(Storage.get({ key: 'authData' })).pipe(
      map((authData) => JSON.parse(authData?.value)?.token),
      switchMap((token) => {
        const clone = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
        return next.handle(clone).pipe(
          catchError((err) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {
                if (this.router.url !== '/login') {
                  this.store.dispatch(new Logout());
                }
              }
              return throwError(err);
            }
          })
        );
      })
    );
  }
}
