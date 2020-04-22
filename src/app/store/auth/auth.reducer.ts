import { AuthActions, AuthActionTypes } from './auth.actions';
import { User } from 'src/app/auth/models/user';

export interface AuthState {
  isLoggedIn: boolean;
  currentUser: User;
  isLoading: boolean;
}

export const initialState: AuthState = {
  isLoggedIn: false,
  currentUser: undefined,
  isLoading: false,
};

export function reducer(state = initialState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.LoginRequested:
      return {
        ...state,
        isLoading: true,
      };

    case AuthActionTypes.LoginSuccess:
    case AuthActionTypes.LoginByToken:
      return {
        ...state,
        isLoggedIn: true,
        isLoading: false,
      };
    case AuthActionTypes.LoginError:
      return {
        ...state,
        isLoading: false,
      };

    case AuthActionTypes.Logout:
      return {
        ...state,
        isLoggedIn: false,
        currentUser: undefined,
      };

    default:
      return state;
  }
}
