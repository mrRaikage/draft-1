import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

import * as organizationSelectors from '../../core/store/organizations/organizations.selectors';
import * as organizationActions from '../../core/store/organizations/organizations.actions';
import { settingLinks } from '../../core/constants/org-settings-links.constants';
import { IOrganizationsState } from '../../core/store/organizations/organizations.reducer';
import { SettingsStateService } from '../../core/services/state/settings/settings-state.service';
import { OrganizationSettingsModel } from '../../core/interfaces/organizations.interface';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  activeTab = 0;
  links = settingLinks;

  constructor(
    private dialog: MatDialog,
    private orgStore: Store<IOrganizationsState>,
    private settingsStateService: SettingsStateService,
    private router: Router
  ) {
    this.orgStore.dispatch(organizationActions.organizationSettings());
    this.orgStore.select(organizationSelectors.selectOrganizationSettings)
      .pipe(filter(res => Boolean(res)))
      .subscribe((orgSettings: OrganizationSettingsModel) => {
        this.settingsStateService.setCurrentOrgSettings(orgSettings);
      });
  }

  ngOnInit(): void {}

  isActiveTab(url: string): boolean {
    return this.router.url.includes(url);
  }

  tabChanged($event: MatTabChangeEvent): void {
    this.activeTab = $event.index;
  }

}
