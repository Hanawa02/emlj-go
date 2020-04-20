import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromStudentsState from './students.reducer';
import { StudentsState } from './students.reducer';

export const selectStudentsState = createFeatureSelector<StudentsState>(
  'students'
);

export const getAllStudents = createSelector(
  selectStudentsState,
  fromStudentsState.selectAll
);

export const getSelectedStudent = createSelector(
  selectStudentsState,
  (state) => {
    if (state.entities && state.selectedStudentId) {
      return state.entities[state.selectedStudentId];
    }

    return null;
  }
);
