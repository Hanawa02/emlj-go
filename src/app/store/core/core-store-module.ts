import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import * as fromCore from './core.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('core', fromCore.reducer),
    MatSnackBarModule,
  ],
  declarations: [],
  providers: [],
  exports: [],
})
export class CoreStoreModule {}
