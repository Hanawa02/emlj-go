import { AuthActions, AuthActionTypes } from './auth.actions';
import { User } from 'src/app/auth/models/user';

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
    case AuthActionTypes.LoginSuccess:
    case AuthActionTypes.LoginByToken:
      return {
        ...state,
        isLoggedIn: true,
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
