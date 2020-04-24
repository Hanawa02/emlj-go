import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromCoreState from './core.reducer';

export const selectCoreState = createFeatureSelector<fromCoreState.CoreState>(
  'core'
);
export const getIsLoading = createSelector(selectCoreState, (state) => {
  return state?.isLoading;
});
