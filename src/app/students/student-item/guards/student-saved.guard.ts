import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  CanDeactivate,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { getIsLoggedIn } from 'src/app/store/auth/auth.selectors.module';
import { StudentItemComponent } from '../student-item.component';

@Injectable({
  providedIn: 'root',
})
export class StudentSavedGuard implements CanDeactivate<StudentItemComponent> {
  constructor() {}

  canDeactivate(component: StudentItemComponent): Observable<boolean> {
    return component.canDeactivate();
  }
}
