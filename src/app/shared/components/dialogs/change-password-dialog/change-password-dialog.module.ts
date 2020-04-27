import { NgModule, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ChangePasswordDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
})
export class ChangePasswordDialogModule {}
