import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsComponent } from './students.component';
import { SharedModule } from '../shared/shared.module';
import { StudentItemComponent } from './student-item/student-item.component';
@NgModule({
  declarations: [StudentsComponent, StudentItemComponent],
  imports: [CommonModule, SharedModule],
})
export class StudentsModule {}
