import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuthState from './auth.reducer';
import { getIsLoading as getIsLoadingFromStudents } from '../students/students.selectors';

export const selectAuthState = createFeatureSelector<fromAuthState.AuthState>(
  'auth'
);

export const getIsLoggedIn = createSelector(
  selectAuthState,
  (state) => state.isLoggedIn
);

export const getCurrentUser = createSelector(selectAuthState, (authState) => {
  const currentUser = authState?.currentUser;
  return {
    ...currentUser,
  };
});

export const getIsLoading = createSelector(selectAuthState, (authState) => {
  return authState?.isLoading;
});
