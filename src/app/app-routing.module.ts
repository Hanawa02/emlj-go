import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { AuthComponent } from './auth/auth.component';
import { StudentsComponent } from './students/students.component';

const appRoutes: Routes = [
  {
    path: 'login',
    component: AuthComponent,
  },
  {
    path: 'alunos',
    canActivate: [AuthGuard],
    component: StudentsComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    redirectTo: '/alunos',
  },
  {
    path: '**',
    canActivate: [AuthGuard],
    redirectTo: '/alunos',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
