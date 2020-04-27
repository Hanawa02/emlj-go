import { AuthActions, AuthActionTypes } from './auth.actions';
import { User } from 'src/app/rest-api';

export interface AuthState {
  isLoggedIn: boolean;
  currentUserEmail: string;
}

export const initialState: AuthState = {
  isLoggedIn: false,
  currentUserEmail: undefined,
};

export function reducer(state = initialState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.LoginRequested:
      return {
        ...state,
      };

    case AuthActionTypes.LoginSuccess:
      return {
        ...state,
        isLoggedIn: true,
        currentUserEmail: action.payload.loginData.user.email,
      };

    case AuthActionTypes.LoginByTokenSuccess:
      return {
        ...state,
        isLoggedIn: true,
        currentUserEmail: action.payload.email,
      };

    case AuthActionTypes.LoginError:
      return {
        ...state,
      };

    case AuthActionTypes.Logout:
      return {
        ...state,
        isLoggedIn: false,
        currentUserEmail: undefined,
      };

    default:
      return state;
  }
}
