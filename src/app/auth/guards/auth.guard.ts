import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Logout } from '../../store/auth/auth.actions';
import { AuthState } from '../../store/auth/auth.reducer';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { getIsLoggedIn } from 'src/app/store/auth/auth.selectors.module';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AuthState>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.pipe(
      select(getIsLoggedIn),
      tap((loggedIn) => {
        if (!loggedIn) {
          this.router.navigate(['login']);
          this.store.dispatch(new Logout());
        }
      })
    );
  }
}
