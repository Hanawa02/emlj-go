import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiModule, Configuration } from './rest-api';
import { AuthStoreModule } from './store/auth/auth-store.module';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './store/auth/auth.effects';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { StudentsStoreModule } from './store/students/students-store.module';
import { AuthInterceptor } from './auth/interceptors/auth.interceptor';
import { BirthdayPersonModule } from './birthday-person/birthday-person.module';
import { SharedModule } from './shared/shared.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CoreStoreModule } from './store/core/core-store-module';
import { registerLocaleData } from '@angular/common';
import localePT from '@angular/common/locales/pt';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getPortuguesePaginatorIntl } from './locale/pt-br.paginator.locale';
import { environment } from 'src/environments/environment';
import { RentsModule } from './rents/rents.module';

registerLocaleData(localePT);

export function apiConfigFactory(): Configuration {
  return new Configuration({
    apiKeys: {},
    basePath: environment.serverBasePath,
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
    SharedModule,
    AuthStoreModule,
    AuthModule,
    StudentsStoreModule,
    StudentsModule,
    CoreStoreModule,
    BirthdayPersonModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
    }),
    RentsModule,
  ],
  providers: [
    Store,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: 'pt',
    },
    { provide: MatPaginatorIntl, useValue: getPortuguesePaginatorIntl() },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
