import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AuthState } from 'src/app/store/auth/auth.reducer';
import { getCurrentUserEmail } from 'src/app/store/auth/auth.selectors';
import { take, tap, takeLast } from 'rxjs/operators';
import {
  UpdatePasswordError,
  UpdatePasswordRequested,
} from 'src/app/store/auth/auth.actions';

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
      .select(getCurrentUserEmail)
      .pipe(take(1))
      .subscribe((userEmail) => (this.email = userEmail));

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
