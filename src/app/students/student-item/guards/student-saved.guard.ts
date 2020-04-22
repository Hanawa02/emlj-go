import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
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
