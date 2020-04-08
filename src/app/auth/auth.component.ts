import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { untilDestroy } from '@ngrx-utils/store';
import { tap } from 'rxjs/operators';
import { AuthState } from '../store/auth/auth.reducer';
import { Store } from '@ngrx/store';
import { LoginRequested } from '../store/auth/auth.actions';
import { User } from '../rest-api';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loginFormErrors: any;
  error: string;

  email: string;
  password: string;

  constructor(
    private store: Store<AuthState>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.loginForm.valueChanges
      .pipe(
        untilDestroy(this),
        tap(() => this.onLoginFormValuesChanged())
      )
      .subscribe();
  }

  onLoginFormValuesChanged(): void {
    for (const field in this.loginFormErrors) {
      if (!this.loginFormErrors.hasOwnProperty(field)) {
        continue;
      }
      // Clear previous errors
      this.loginFormErrors[field] = {};
      // Get the control
      const control = this.loginForm.get(field);
      if (control && control.dirty && !control.valid) {
        this.loginFormErrors[field] = control.errors;
      }
    }
  }

  login(): void {
    // const email = this.email;
    // const password = this.password;
    const { email, password } = this.loginForm.value;

    const login: User = { email, password, id: undefined, username: undefined };
    console.log(login);
    this.store.dispatch(new LoginRequested({ login }));
  }

  ngOnDestroy(): void {
    // do not remove, necessary for untilDestroy()
  }
}
