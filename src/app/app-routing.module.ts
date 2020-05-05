import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { AuthComponent } from './auth/auth.component';
import { StudentsComponent } from './students/students.component';
import { StudentItemComponent } from './students/student-item/student-item.component';
import { StudentSavedGuard } from './students/student-item/guards/student-saved.guard';
import { BirthdayPersonComponent } from './birthday-person/birthday-person.component';
import { LoginGuard } from './auth/guards/login.guard';
import { RentsComponent } from './rents/rents.component';

const appRoutes: Routes = [
  {
    path: 'login',
    canActivate: [LoginGuard],
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
    path: 'editarAluno/:id',
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
    path: 'emprestimos',
    canActivate: [AuthGuard],
    component: RentsComponent,
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
