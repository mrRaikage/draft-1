import { CanDeactivate } from '@angular/router';

import { InvoicingTabComponent } from '../../components/invoicing-tab/invoicing-tab.component';
import { OrganizationTabComponent } from '../../components/organization-tab/organization-tab.component';
import { ProfileTabComponent } from '../../components/profile-tab/profile-tab.component';
import { SettingsPricebookTabComponent } from '../../components/settings-pricebook-tab/settings-pricebook-tab.component';
import { UsersTabComponent } from '../../components/users-tab/users-tab.component';

type SettingsTabType =
  ProfileTabComponent |
  UsersTabComponent |
  InvoicingTabComponent |
  OrganizationTabComponent |
  SettingsPricebookTabComponent;

export class DeactivateGuard implements CanDeactivate<SettingsTabType> {

  async canDeactivate(component: SettingsTabType): Promise<boolean> {
    if (component.unsavedChanges) {
      return component.canDeactivate();
    }
    return Promise.resolve(true);
  }
}
