import { createSelector } from '@ngrx/store';

export const selectAuthState = (state) => state;

export const selectUser = createSelector(
  selectAuthState,
  state => state.auth && state.auth.userData
);

export const selectIsSpinnerStarted = createSelector(
  selectAuthState,
  state => state.auth.spinnerStarted
);

export const selectIsLoadAfterActionSuccess = createSelector(
  selectAuthState,
  state => state.auth.loadAfterActionSuccess
);

export const selectIsGoogleSpinnerStarted = createSelector(
  selectAuthState,
  state => state.auth.googleSpinnerStarted
);

export const selectIsUserNameSpinnerStarted = createSelector(
  selectAuthState,
  state => state.auth.userNameSpinnerStarted
);

export const selectTokenIsRefreshed = createSelector(
  selectAuthState,
  state => state.auth.tokenIsRefreshed
);
