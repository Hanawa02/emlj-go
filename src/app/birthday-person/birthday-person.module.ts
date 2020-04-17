import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BirthdayPersonComponent } from './birthday-person.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [BirthdayPersonComponent],
  imports: [CommonModule, SharedModule],
})
export class BirthdayPersonModule {}
