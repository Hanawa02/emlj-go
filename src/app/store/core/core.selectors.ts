import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromCoreState from './core.reducer';

import { getIsLoading as getIsLoadingFromAuth } from '../auth/auth.selectors';
import { getIsLoading as getIsLoadingFromStudents } from '../students/students.selectors';

export const selectCoreState = createFeatureSelector<fromCoreState.CoreState>(
  'core'
);
export const getIsLoading = createSelector(
  selectCoreState,
  getIsLoadingFromAuth,
  getIsLoadingFromStudents,
  (state, isLoadingFromAuth, isLoadingFromStudents) => {
    const isLoading =
      state?.isLoading || isLoadingFromAuth || isLoadingFromStudents;
    return isLoading;
  }
);
