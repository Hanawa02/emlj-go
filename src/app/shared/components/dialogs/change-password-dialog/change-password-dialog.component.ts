import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AuthState } from 'src/app/store/auth/auth.reducer';
import { getCurrentUser } from 'src/app/store/auth/auth.selectors';
import { take } from 'rxjs/operators';
import { UpdatePasswordRequested } from 'src/app/store/auth/auth.actions';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss'],
})
export class ChangePasswordDialogComponent implements OnInit {
  form: FormGroup;
  email: string;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private store: Store<AuthState>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.store
      .select(getCurrentUser)
      .pipe(take(1))
      .subscribe((user) => (this.email = user.email));

    this.form = this.formBuilder.group({
      newPassword: ['', [Validators.minLength(8)]],
      password: ['', []],
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  async changePassword() {
    this.store.dispatch(
      new UpdatePasswordRequested({
        email: this.email,
        password: this.form.value.password,
        newPassword: this.form.value.newPassword,
      })
    );

    this.closeDialog();
  }
}
