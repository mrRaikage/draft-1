import { Action, createReducer, on } from '@ngrx/store';

import * as authActions from './auth.actions';
import { UserModel } from '../../shared/interfaces/user-data.interface';

export interface IAuthState {
  userData: UserModel;
  spinnerStarted: boolean;
  googleSpinnerStarted: boolean;
  userNameSpinnerStarted: boolean;
  tokenIsRefreshed: boolean;
  loadAfterActionSuccess: boolean;
}

export const initialState: IAuthState = {
  userData: null,
  spinnerStarted: false,
  googleSpinnerStarted: false,
  userNameSpinnerStarted: false,
  tokenIsRefreshed: true,
  loadAfterActionSuccess: false,
};

export function authReducer(state: IAuthState | undefined, action: Action): IAuthState {
  return reducer(state, action);
}

const reducer = createReducer<IAuthState>(
  initialState,

  /** Sign In */
  on(authActions.signIn, state => ({
    ...state,
    spinnerStarted: true
  })),

  on(authActions.signInWithGoogle, state => ({
    ...state,
    googleSpinnerStarted: true
  })),

  on(authActions.signInSuccess, (state, { data }) => ({
    ...state,
    userData: data,
  })),

  on(authActions.stopSpinner, state => ({
    ...state,
    spinnerStarted: false,
    googleSpinnerStarted: false
  })),

  on(authActions.signInFailure, (state) => ({
    ...state,
    spinnerStarted: false
  })),

  /** Sign Up */
  on(authActions.signUp, state => ({
    ...state,
    spinnerStarted: true,
  })),

  on(authActions.signUpWithGoogle, state => ({
    ...state,
    googleSpinnerStarted: true,
  })),

  on(authActions.signUpSuccess, (state, { data }) => ({
    ...state,
    userData: data,
  })),

  on(authActions.signUpFailure, (state) => ({
    ...state,
    spinnerStarted: false,
    googleSpinnerStarted: false,
  })),

  /** Forgot password */
  on(authActions.forgotPassword, state => ({
    ...state,
    spinnerStarted: true
  })),

  on(authActions.forgotPasswordSuccess, (state) => ({
      ...state,
      spinnerStarted: false
    })
  ),

  on(authActions.forgotPasswordFailure, (state) => ({
    ...state,
    spinnerStarted: false
  })),

  /** Change password */
  on(authActions.changePassword, state => ({
    ...state,
    spinnerStarted: true,
    loadAfterActionSuccess: false
  })),

  on(authActions.changePasswordSuccess, (state) => ({
      ...state,
      spinnerStarted: false,
      loadAfterActionSuccess: true
    })
  ),

  on(authActions.changePasswordFailure, (state) => ({
    ...state,
    spinnerStarted: false,
  })),

  /** Change UserName */
  on(authActions.changeUserName, state => ({
    ...state,
    userNameSpinnerStarted: true,
  })),

  on(authActions.changeUserNameSuccess, state => ({
    ...state,
    userNameSpinnerStarted: false,
  })),

  on(authActions.changeUserNameFailure, state => ({
    ...state,
    userNameSpinnerStarted: false,
  })),

  /** Refresh Token */
  on(authActions.refreshToken, state => ({
    ...state,
    tokenIsRefreshed: false,
  })),

  on(authActions.refreshTokenSuccess, state => ({
    ...state,
    tokenIsRefreshed: true,
  })),

  on(authActions.refreshToken, state => ({
    ...state,
    tokenIsRefreshed: false,
  })),
);
