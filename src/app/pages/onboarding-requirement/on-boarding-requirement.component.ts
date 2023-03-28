import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { IOrganizationsState } from '../../core/store/organizations/organizations.reducer';
import * as orgActions from '../../core/store/organizations/organizations.actions';
import { selectIsSpinnerStarted } from '../../core/store/organizations/organizations.selectors';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
  selector: 'app-on-boarding-requirement',
  templateUrl: './on-boarding-requirement.component.html',
  styleUrls: ['./on-boarding-requirement.component.scss']
})
export class OnBoardingRequirementComponent implements OnInit {
  form: FormGroup = new FormGroup({
    displayName: new FormControl(this.lSService.getUserData().displayName, Validators.required),
    orgName: new FormControl('', Validators.required)
  });
  spinnerStarted$ = this.orgStore.select(selectIsSpinnerStarted);

  constructor(
    private orgStore: Store<IOrganizationsState>,
    private lSService: LocalStorageService
  ) { }

  ngOnInit(): void {
  }

  sendForm(): void {
    if (this.form.invalid) {
      return;
    }
    this.orgStore.dispatch(orgActions.addFirstOrganization(this.form.getRawValue()));
  }
}
