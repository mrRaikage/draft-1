import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { OrganizationSettingsModel } from '../../../interfaces/organizations.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsStateService {

  private currentOrgSettingsSubject: BehaviorSubject<OrganizationSettingsModel> = new BehaviorSubject<OrganizationSettingsModel>(null);

  currentOrgSettings$: Observable<OrganizationSettingsModel> = this.currentOrgSettingsSubject.asObservable();

  constructor() { }

  public setCurrentOrgSettings(orgSettings: OrganizationSettingsModel): void {
    this.currentOrgSettingsSubject.next(orgSettings);
  }
}
