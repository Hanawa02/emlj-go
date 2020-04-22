import { CoreActions, CoreActionTypes } from './core.actions';
import { User } from 'src/app/auth/models/user';

export interface CoreState {
  isLoading: boolean;
}

export const initialState: CoreState = {
  isLoading: false,
};

export function reducer(state = initialState, action: CoreActions): CoreState {
  switch (action.type) {
    case CoreActionTypes.SetIsLoading:
      return {
        isLoading: action.payload.value,
      };

    default:
      return state;
  }
}
