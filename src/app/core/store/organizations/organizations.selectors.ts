import { createSelector } from '@ngrx/store';

export const selectOrganizationsState = (state) => state;

export const selectOrganizationsData = createSelector(
  selectOrganizationsState,
  state => state.organizations.list
);

export const selectIsSpinnerStarted = createSelector(
  selectOrganizationsState,
  state => state.organizations.spinnerStarted
);

export const selectIsCurrentOrgChanged = createSelector(
  selectOrganizationsState,
  state => state.organizations.currentOrgChanged
);

export const selectOrganizationSettings = createSelector(
  selectOrganizationsState,
  state => state.organizations.organizationSettings
);

export const selectIsOrganizationsSettingsLoaded = createSelector(
  selectOrganizationsState,
  state => state.organizations.organizationsSettingsLoaded
);

export const selectIsOrgSettingsSpinnerStarted = createSelector(
  selectOrganizationsState,
  state => state.organizations.orgSettingsSpinnerStarted
);

export const selectOrganizationUsers = createSelector(
  selectOrganizationsState,
  state => state.organizations.organizationUsers
);

export const selectIsOrganizationUsersLoading = createSelector(
  selectOrganizationsState,
  state => state.organizations.organizationUsersLoading
);

export const selectIsRemoveSpinnerStarted = createSelector(
  selectOrganizationsState,
  state => state.organizations.removeSpinnerStarted
);

