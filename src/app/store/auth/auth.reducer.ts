import { AuthActions, AuthActionTypes } from './auth.actions';
import { User } from 'src/app/rest-api';

export interface AuthState {
  isLoggedIn: boolean;
  currentUser: User;
}

export const initialState: AuthState = {
  isLoggedIn: false,
  currentUser: undefined,
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
        currentUser: action.payload.loginData.user,
      };

    case AuthActionTypes.LoginByTokenSuccess:
      return {
        ...state,
        isLoggedIn: true,
        currentUser: action.payload.user,
      };

    case AuthActionTypes.LoginError:
      return {
        ...state,
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
