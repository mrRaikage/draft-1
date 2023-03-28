import { createAction, props } from '@ngrx/store';

import {
  OrganizationModel,
  OrganizationSettingsModel,
  OrganizationUserModel,
} from '../../interfaces/organizations.interface';

/** Get Organizations */
export const organizationsData = createAction(
  '[Organizations] Organizations Data',
  props<{ redirect?: boolean }>()
);
export const organizationsDataSuccess = createAction(
  '[Organizations] Organizations Data Success',
  props<{ data: OrganizationModel[], redirect?: boolean }>()
);
export const organizationsDataFailure = createAction('[Organizations] Organizations Data Failure');

/** Update Current Organization */
export const setCurrentOrganization = createAction('[Organizations] Set Current Organization', props<{ org: OrganizationModel }>());
export const setCurrentOrganizationSuccess = createAction('[Organizations] Set Current Organization Success');
export const setCurrentOrganizationFailure = createAction('[Organizations] Set Current Organization Failure');

/** Add First Organization */
export const addFirstOrganization = createAction('[Organizations] Add First Organization', props<{ displayName: string, orgName: string }>());
export const addFirstOrganizationSuccess = createAction('[Organizations] Add First Organization Success', props<{ data: OrganizationModel }>());
export const addFirstOrganizationFailure = createAction('[Organizations] Add First Organization Failure');

/** Add Organization */
export const addOrganization = createAction('[Organizations] Add Organization', props<{ orgName: string }>());
export const addOrganizationSuccess = createAction('[Organizations] Add Organization Success', props<{ data: OrganizationModel }>());
export const addOrganizationFailure = createAction('[Organizations] Add Organization Failure');


/** Get Organization Settings */
export const organizationSettings = createAction('[Organizations] Organization Settings');
export const organizationSettingsSuccess = createAction('[Organizations] Organization Settings Success', props<{
  orgSettings: OrganizationSettingsModel
}>());
export const organizationSettingsFailure = createAction('[Organizations] Organization Settings Failure');

/** Edit Organization Settings */
export const editOrganizationSettings = createAction('[Organizations] Edit Organization Settings', props<{
  orgSettings: OrganizationSettingsModel
}>());
export const editOrganizationSettingsSuccess = createAction('[Organizations] Edit Organization Settings Success');
export const editOrganizationSettingsFailure = createAction('[Organizations] Edit Organization Settings Failure');

/** Upload Organization Logo */
export const uploadOrganizationLogo = createAction('[Organizations] Upload Organization Logo', props<{
  formData: FormData
}>());
export const uploadOrganizationLogoSuccess = createAction('[Organizations] Upload Organization Logo Success');
export const uploadOrganizationLogoFailure = createAction('[Organizations] Upload Organization Logo Failure');

/** Get Organization Users */
export const organizationUsers = createAction('[Organizations] Organization Users');
export const organizationUsersSuccess = createAction(
  '[Organizations] Organization Users Success',
  props<{ orgUsers: OrganizationUserModel[]}>()
);
export const organizationUsersFailure = createAction('[Organizations] Organization Users Failure');

/** Invite Organization User */
export const inviteOrganizationUser = createAction('[Organizations] Invite Organization User', props<{ email: string }>());
export const inviteOrganizationUserSuccess = createAction('[Organizations] Invite Organization User Success');
export const inviteOrganizationUserFailure = createAction('[Organizations] Invite Organization User Failure');

/** Remove Organization User */
export const removeOrganizationUser = createAction('[Organizations] Remove Organization User', props<{ email: string }>());
export const removeOrganizationUserSuccess = createAction('[Organizations] Remove Organization User Success');
export const removeOrganizationUserFailure = createAction('[Organizations] Remove Organization User Failure');

/** Clean State */
export const cleanState = createAction('[Organizations] Clean State');

