import { Component, Output, EventEmitter, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { LocalStorageService } from '../../services/local-storage.service';
import { OrganizationModel } from '../../../core/interfaces/organizations.interface';
import { IOrganizationsState } from '../../../core/store/organizations/organizations.reducer';
import { selectOrganizationsData } from '../../../core/store/organizations/organizations.selectors';
import { setCurrentOrganization } from '../../../core/store/organizations/organizations.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Output() toggleSideBar = new EventEmitter();

  orgList$: Observable<OrganizationModel[]> = this.orgStore.select(selectOrganizationsData);

  panelOpened: boolean;
  formControl: FormControl = new FormControl(this.currentOrg);

  @ViewChild('select') select: MatSelect;
  @ViewChildren('content') content: QueryList<any>;

  get currentOrg(): OrganizationModel {
    return this.lSService.getCurrentOrg();
  }

  constructor(
    public lSService: LocalStorageService,
    private orgStore: Store<IOrganizationsState>
  ) {}

  updateCurrentOrg(item: OrganizationModel): void {
    this.orgStore.dispatch(setCurrentOrganization({ org: item }));
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }

}
