import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuthState from './auth.reducer';

export const selectAuthState = createFeatureSelector<fromAuthState.AuthState>(
  'auth'
);

export const getIsLoggedIn = createSelector(
  selectAuthState,
  (state) => state.isLoggedIn
);

export const getCurrentUserEmail = createSelector(
  selectAuthState,
  (authState) => {
    return authState?.currentUserEmail;
  }
);
