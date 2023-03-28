import { createAction, props } from '@ngrx/store';
import { UserModel } from '../../shared/interfaces/user-data.interface';

export const signIn = createAction('[Auth] Sign In', props<{ username: string, password: string, isRemember: boolean }>());
export const signInWithGoogle = createAction('[Auth] Sign In With Google');
export const signInSuccess = createAction('[Auth] Sign In Success', props<{ data: UserModel }>());
export const signInFailure = createAction('[Auth] Sign In Failure');

export const signUp = createAction('[Auth] Sign Up', props<{ username: string, confirmPassword: string}>());
export const signUpWithGoogle = createAction('[Auth] Sign Up With Google');
export const signUpSuccess = createAction('[Auth] Sign Up Success', props<{ data }>());
export const signUpFailure = createAction('[Auth] Sign Up Failure');

export const forgotPassword = createAction('[Auth] Forgot Password', props<{ email: string }>());
export const forgotPasswordSuccess = createAction('[Auth] Forgot Password Success');
export const forgotPasswordFailure = createAction('[Auth] Forgot Password Failure');

export const changePassword = createAction('[Auth] Change Password', props<{ confirmPassword: string, navigateTo?: string }>());
export const changePasswordSuccess = createAction('[Auth] Change Password Success', props<{ navigateTo?: string }>());
export const changePasswordFailure = createAction('[Auth] Change Password Failure');

export const refreshToken = createAction('[Auth] Refresh Token', props<{ refreshToken: string }>());
export const refreshTokenSuccess = createAction('[Auth] Refresh Token Success', props<{ data }>());
export const refreshTokenFailure = createAction('[Auth] Refresh Token Failure');

export const changeUserName = createAction('[Auth] Change User Name', props<{ userName: string }>());
export const changeUserNameSuccess = createAction('[Auth] Change User Name Success');
export const changeUserNameFailure = createAction('[Auth] Change User Name Failure');

export const userSettings = createAction('[Auth] User Settings');
export const userSettingsSuccess = createAction('[Auth] User Settings Success');
export const userSettingsFailure = createAction('[Auth] User Settings Failure');

export const stopSpinner = createAction('[Auth] Stop Spinner');
