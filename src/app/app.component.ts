import { Component, OnInit } from '@angular/core';
import { LoginByToken, Logout, WakeUpServer } from './store/auth/auth.actions';
import { Plugins } from '@capacitor/core';
import { Store, select } from '@ngrx/store';
import { AuthState } from './store/auth/auth.reducer';
import { getIsLoggedIn } from './store/auth/auth.selectors.module';
import { LoadStudentsRequested } from './store/students/students.actions';

const { Storage } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private store: Store<AuthState>) {
    this.store.dispatch(new WakeUpServer());
  }

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
