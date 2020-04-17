import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StudentsEffects } from './students.effects';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import * as fromStudents from './students.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('students', fromStudents.reducer),
    EffectsModule.forFeature([StudentsEffects]),
    MatSnackBarModule,
  ],
  declarations: [],
  providers: [],
  exports: [],
})
export class StudentsStoreModule {}
