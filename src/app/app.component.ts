import { Component, OnInit } from '@angular/core';
import { LoginByToken, Logout, WakeUpServer } from './store/auth/auth.actions';
import { Plugins } from '@capacitor/core';
import { Store, select } from '@ngrx/store';
import { AuthState } from './store/auth/auth.reducer';
import { getIsLoggedIn } from './store/auth/auth.selectors';
import { LoadStudentsRequested } from './store/students/students.actions';
import { getIsLoading } from './store/core/core.selectors';
import {
  Router,
  NavigationEnd,
  RouterEvent,
  NavigationStart,
} from '@angular/router';
import { SetIsLoading } from './store/core/core.actions';
import { filter } from 'rxjs/operators';
const { Storage } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private store: Store<AuthState>, public router: Router) {
    this.store.dispatch(new WakeUpServer());

    this.router.events
      .pipe(
        filter(
          (e) => e instanceof NavigationStart || e instanceof NavigationEnd
        )
      )
      .subscribe((e) => {
        const loading = e instanceof NavigationStart;

        this.store.dispatch(new SetIsLoading(loading));
      });
  }

  isLoading$ = this.store.pipe(select(getIsLoading));
  isLoggedIn$ = this.store.pipe(select(getIsLoggedIn));
  async ngOnInit(): Promise<void> {
    const token = await Storage.get({ key: 'token' });
    if (token.value) {
      this.store.dispatch(new LoginByToken({ token: token.value }));
    } else {
      this.store.dispatch(new LoadStudentsRequested());
    }
  }

  Logout(): void {
    this.store.dispatch(new Logout());
  }
}
