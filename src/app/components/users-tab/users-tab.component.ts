import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material/table';
import { filter, takeUntil } from 'rxjs/operators';

import * as organizationSelectors from '../../core/store/organizations/organizations.selectors';
import * as organizationActions from '../../core/store/organizations/organizations.actions';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { IOrganizationsState } from '../../core/store/organizations/organizations.reducer';
import { OrganizationUserModel } from '../../core/interfaces/organizations.interface';
import { validatorsPattern } from '../../shared/utils/validators/validator-pattern';
import { SettingsActionsService } from '../../core/services/state/settings/settings-actions.service';

@Component({
  selector: 'app-users-tab',
  templateUrl: './users-tab.component.html',
  styleUrls: ['./users-tab.component.scss']
})
export class UsersTabComponent implements OnInit {

  subscription$ = new Subject();
  spinnerStarted$: Observable<boolean> = this.orgStore.select(organizationSelectors.selectIsSpinnerStarted);
  removeSpinnerStarted$: Observable<boolean> = this.orgStore.select(organizationSelectors.selectIsRemoveSpinnerStarted);
  organizationUsersLoading$: Observable<boolean> = this.orgStore.select(organizationSelectors.selectIsOrganizationUsersLoading);

  displayedColumns: string[] = ['email', 'role', 'actions'];
  dataSource = new MatTableDataSource();
  form: FormGroup = this.fb.group({ rows: this.fb.array([]) });
  currentIndex: number;
  unsavedChanges = false;

  get formArrayRows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    public lSService: LocalStorageService,
    private orgStore: Store<IOrganizationsState>,
    private cdr: ChangeDetectorRef,
    private settingsActionsService: SettingsActionsService
  ) {
    this.orgStore.dispatch(organizationActions.organizationUsers());
  }

  ngOnInit(): void {
    this.orgStore.select(organizationSelectors.selectOrganizationUsers)
      .pipe(takeUntil(this.subscription$), filter(res => Boolean(res)))
      .subscribe((users: OrganizationUserModel[]) => {
        this.formArrayRows.clear();
        users.map((row: OrganizationUserModel) => this.addLineToFormArray(row));
        this.dataSource.data = this.formArrayRows.controls;
        this.unsavedChanges = false;
        this.cdr.detectChanges();
      });
  }

  addLineToFormArray(row: OrganizationUserModel): void {
    const newRow = this.fb.group({
      email: new FormControl(row.user.email, [Validators.required, validatorsPattern.email]),
      role: new FormControl(row.role),
      actions: new FormControl(this.getActionList(row)),
      isDisabled: new FormControl(true)
    });
    this.formArrayRows.push(newRow);
  }

  getActionList(user: OrganizationUserModel): string[] {
    return this.lSService.getUserData().email === user.user.email || user.role === 'Owner'
      ? ['']
      : ['delete'];
  }

  findAction(actions: string[], action: string): boolean {
    return actions.includes(action);
  }

  addRow(): void {
    const row = this.fb.group({
      email: new FormControl('', [Validators.required, validatorsPattern.email]),
      role: new FormControl('Admin'),
      actions: new FormControl(['invite', 'cancel']),
      isDisabled: new FormControl(false)
    });
    this.formArrayRows.push(row);
    this.dataSource.data = this.formArrayRows.controls;
    this.unsavedChanges = true;
  }

  inviteButtonClick(row: FormGroup): void {
    this.orgStore.dispatch(organizationActions.inviteOrganizationUser({ email: row.value.email }));
  }

  removeButtonClick(row: FormGroup): void {
    this.orgStore.dispatch(organizationActions.removeOrganizationUser({ email: row.value.email }));
  }

  cancelButtonClick(index: number): void {
    this.formArrayRows.removeAt(index);
    this.dataSource.data = this.formArrayRows.controls;
  }

  canDeactivate(): Promise<boolean> {
    return this.settingsActionsService.openConfirmExitDialog();
  }
}
