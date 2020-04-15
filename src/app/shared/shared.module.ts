import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgLetModule } from '@ngrx-utils/store';

import { ApiModule } from '../rest-api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CPFFormatPipe } from './pipes/cpf-format.pipe';

@NgModule({
  declarations: [CPFFormatPipe],
  imports: [CommonModule],
  exports: [ApiModule, NgLetModule, BrowserAnimationsModule, CPFFormatPipe],
  providers: [CPFFormatPipe],
})
export class SharedModule {}
