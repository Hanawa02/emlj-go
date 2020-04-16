import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiModule, Configuration } from './rest-api';
import { AuthStoreModule } from './store/auth/auth-store.module';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './store/auth/auth.effects';
import { AuthModule } from './auth/auth.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { StudentsModule } from './students/students.module';
import { StudentsStoreModule } from './store/students/students-store.module';
import { AuthInterceptor } from './auth/interceptors/auth.interceptor';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { BirthdayPersonModule } from './birthday-person/birthday-person.module';

export function apiConfigFactory(): Configuration {
  return new Configuration({
    apiKeys: {},
    basePath: 'https://gakkou-service.herokuapp.com',
  });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ApiModule.forRoot(apiConfigFactory),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([AuthEffects]),
    AuthStoreModule,
    AuthModule,
    StudentsStoreModule,
    StudentsModule,
    MatIconModule,
    MatNativeDateModule,
    BirthdayPersonModule,
  ],
  providers: [
    Store,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
