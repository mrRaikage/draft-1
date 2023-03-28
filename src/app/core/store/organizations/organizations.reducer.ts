import { Action, createReducer, on } from '@ngrx/store';

import * as organizationsActions from './organizations.actions';
import {
  OrganizationModel,
  OrganizationSettingsModel,
  OrganizationUserModel
} from '../../interfaces/organizations.interface';

export interface IOrganizationsState {
  list: OrganizationModel[];
  currentOrg: OrganizationModel;
  organizationUsers: OrganizationUserModel[];
  organizationSettings: OrganizationSettingsModel;
  organizationsSettingsLoaded: boolean;
  orgSettingsSpinnerStarted: boolean;
  spinnerStarted: boolean;
  currentOrgChanged: boolean;
  organizationUsersLoading: boolean;
  removeSpinnerStarted: boolean;
}

export const initialState: IOrganizationsState = {
  list: [],
  currentOrg: null,
  organizationSettings: null,
  organizationUsers: null,
  organizationsSettingsLoaded: false,
  spinnerStarted: false,
  currentOrgChanged: false,
  orgSettingsSpinnerStarted: false,
  organizationUsersLoading: false,
  removeSpinnerStarted: false
};

export function organizationsReducer(state: IOrganizationsState | undefined, action: Action): IOrganizationsState {
  return reducer(state, action);
}

const reducer = createReducer<IOrganizationsState>(
  initialState,

  /** Get Organizations */
  on(organizationsActions.organizationsDataSuccess, (state, { data }) => ({
    ...state,
    list: data
    })
  ),

  on(organizationsActions.organizationsDataFailure, (state) => ({
    ...state,
  })),

  /** Add First Organization */
  on(organizationsActions.addFirstOrganization, (state ) => ({
    ...state,
    spinnerStarted: true
  })),
  on(organizationsActions.addFirstOrganizationSuccess, (state, { data }) => ({
    ...state,
    currentOrg: data,
    spinnerStarted: false
  })),
  on(organizationsActions.addFirstOrganizationFailure, (state) => ({
    ...state,
    spinnerStarted: false
  })),

  /** Add Organization */
  on(organizationsActions.addOrganization, (state ) => ({
    ...state,
    spinnerStarted: true
  })),
  on(organizationsActions.addOrganizationSuccess, (state, { data }) => ({
    ...state,
    currentOrg: data,
    spinnerStarted: false
  })),
  on(organizationsActions.addOrganizationFailure, (state) => ({
    ...state,
    spinnerStarted: false
  })),

  /** Update Current Org */
  on(organizationsActions.setCurrentOrganization, (state ) => ({
    ...state,
    currentOrgChanged: false
  })),

  on(organizationsActions.setCurrentOrganizationSuccess, (state ) => ({
    ...state,
    currentOrgChanged: true
  })),

  /** Get Organization Settings */
  on(organizationsActions.organizationSettings, (state ) => ({
    ...state,
    organizationSettings: null,
    organizationsSettingsLoaded: false,
  })),

  on(organizationsActions.organizationSettingsSuccess, (state, { orgSettings } ) => ({
    ...state,
    organizationSettings: orgSettings,
    organizationsSettingsLoaded: true,
    orgSettingsSpinnerStarted: false
  })),

  /** Edit Organization Settings */
  on(organizationsActions.editOrganizationSettings, (state ) => ({
    ...state,
    orgSettingsSpinnerStarted: true,
  })),

  /** Get Organization Users */
  on(organizationsActions.organizationUsers, (state) => ({
    ...state,
    organizationUsersLoading: true,
  })),

  on(organizationsActions.organizationUsersSuccess, (state, { orgUsers }) => ({
    ...state,
    organizationUsers: orgUsers,
    organizationUsersLoading: false,
  })),

  on(organizationsActions.organizationUsersFailure, (state) => ({
    ...state,
    organizationUsersLoading: false,
  })),

  /** Add Organization User */
  on(organizationsActions.inviteOrganizationUser, (state) => ({
    ...state,
    spinnerStarted: true
  })),

  on(organizationsActions.inviteOrganizationUserSuccess, (state) => ({
    ...state,
    spinnerStarted: false
  })),

  on(organizationsActions.inviteOrganizationUserFailure, (state) => ({
    ...state,
    spinnerStarted: false
  })),

  /** Revoke Organization User */
  on(organizationsActions.removeOrganizationUser, (state) => ({
    ...state,
    removeSpinnerStarted: true
  })),

  on(organizationsActions.removeOrganizationUserSuccess, (state) => ({
    ...state,
    removeSpinnerStarted: false
  })),

  on(organizationsActions.removeOrganizationUserFailure, (state) => ({
    ...state,
    removeSpinnerStarted: false
  })),

  /** Clean State */
  on(organizationsActions.cleanState, state => initialState)

);
