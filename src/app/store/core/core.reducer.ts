import { CoreActions, CoreActionTypes } from './core.actions';

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
        isLoading: action.payload,
      };

    default:
      return state;
  }
}
