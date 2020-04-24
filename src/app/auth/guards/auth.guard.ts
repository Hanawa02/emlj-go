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
import { tap, take } from 'rxjs/operators';
import { getIsLoggedIn } from 'src/app/store/auth/auth.selectors';
import { SetIsLoading } from 'src/app/store/core/core.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AuthState>, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    let result;
    await this.store
      .pipe(
        take(1),
        select(getIsLoggedIn),
        tap((loggedIn) => {
          result = loggedIn;
          if (!loggedIn) {
            // this.router.navigate(['login']);
            this.store.dispatch(new Logout());
          }
        })
      )
      .subscribe();

    return result;
  }
}
