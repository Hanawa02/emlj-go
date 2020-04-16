import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { AuthComponent } from './auth/auth.component';
import { StudentsComponent } from './students/students.component';
import { StudentItemComponent } from './students/student-item/student-item.component';
import { StudentSavedGuard } from './students/student-item/guards/student-saved.guard';
import { BirthdayPersonComponent } from './birthday-person/birthday-person.component';

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
    path: 'novoAluno',
    canActivate: [AuthGuard],
    canDeactivate: [StudentSavedGuard],
    component: StudentItemComponent,
  },
  {
    path: 'aniversariantes',
    canActivate: [AuthGuard],
    component: BirthdayPersonComponent,
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
