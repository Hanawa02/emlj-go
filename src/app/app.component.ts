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
import { stringify } from 'querystring';
import { AuthData } from './shared/models/auth.data';
import { ChangePasswordDialogModule } from './shared/components/dialogs/change-password-dialog/change-password-dialog.module';
import { ChangePasswordDialogComponent } from './shared/components/dialogs/change-password-dialog/change-password-dialog.component';
import { MatDialog } from '@angular/material/dialog';
const { Storage } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoading$ = this.store.pipe(select(getIsLoading));
  isLoggedIn$ = this.store.pipe(select(getIsLoggedIn));

  constructor(
    private store: Store<AuthState>,
    public router: Router,
    public dialog: MatDialog
  ) {
    this.store.dispatch(new WakeUpServer());

    this.router.events
      .pipe(
        filter(
          (e) => e instanceof NavigationStart || e instanceof NavigationEnd
        )
      )
      .subscribe((e) => {
        const loading = e instanceof NavigationStart;

        if (loading) {
          this.store.dispatch(new SetIsLoading(loading));
        } else {
          setTimeout(() => {
            this.store.dispatch(new SetIsLoading(loading));
          }, 500);
        }
      });
  }

  async ngOnInit(): Promise<void> {
    const storedAuthData = await Storage.get({ key: 'authData' });

    const authData: AuthData = JSON.parse(storedAuthData?.value);

    if (authData) {
      this.store.dispatch(new LoginByToken(authData));
    }
  }

  Logout(): void {
    this.store.dispatch(new Logout());
  }

  openChangePasswordModal() {
    this.dialog.open(ChangePasswordDialogComponent);
  }
}
