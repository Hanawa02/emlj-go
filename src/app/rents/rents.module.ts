import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentsComponent } from './rents.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [RentsComponent],
  imports: [CommonModule, SharedModule],
})
export class RentsModule {}
