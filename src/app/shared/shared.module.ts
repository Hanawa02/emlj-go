import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgLetModule } from '@ngrx-utils/store';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';

import { ApiModule } from '../rest-api';
import { CPFFormatPipe } from './pipes/cpf-format.pipe';
import { RadioButtonModule } from './components/radio-button/radio-button.module';
import { CEPFormatPipe } from './pipes/cep-format.pipe';
import { PhoneFormatPipe } from './pipes/phone-format.pipe';

const angularMaterialModules = [
  MatIconModule,
  MatNativeDateModule,
  MatRadioModule,
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatDatepickerModule,
  MatSortModule,
  MatSelectModule,
];

const pipes = [CPFFormatPipe, CEPFormatPipe, PhoneFormatPipe];
@NgModule({
  declarations: [...pipes],
  imports: [CommonModule, ...angularMaterialModules, RadioButtonModule],
  exports: [
    BrowserAnimationsModule,
    ApiModule,
    NgLetModule,
    ...angularMaterialModules,
    ...pipes,
    FormsModule,
    ReactiveFormsModule,
    CdkTableModule,
    RadioButtonModule,
  ],
  providers: [...pipes],
})
export class SharedModule {}
