import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter, takeUntil } from 'rxjs/operators';

import { UserModel } from '../../shared/interfaces/user-data.interface';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { MustMatch } from '../../auth/utils/validator';
import * as authActions from '../../auth/store/auth.actions';
import * as authSelectors from '../../auth/store/auth.selectors';
import { IAuthState } from '../../auth/store/auth.reducer';
import { SettingsActionsService } from '../../core/services/state/settings/settings-actions.service';

@Component({
  selector: 'app-profile-tab',
  templateUrl: './profile-tab.component.html',
  styleUrls: ['./profile-tab.component.scss']
})
export class ProfileTabComponent implements OnInit, OnDestroy {

  subscription$ = new Subject();
  formUserName: FormGroup;
  formPassword: FormGroup;
  isPasswordFormDisplayed = false;
  unsavedChanges = false;

  userNameSpinnerStarted$ = this.authStore.select(authSelectors.selectIsUserNameSpinnerStarted);
  passwordSpinnerStarted$ = this.authStore.select(authSelectors.selectIsSpinnerStarted);

  get currentUser(): UserModel {
    return this.lSService.getUserData();
  }

  constructor(
    private fb: FormBuilder,
    public lSService: LocalStorageService,
    private authStore: Store<IAuthState>,
    private settingsActionsService: SettingsActionsService
  ) { }

  ngOnInit(): void {
    this.formUserName = this.fb.group({
      userName: new FormControl(this.currentUser?.displayName)
    });
    this.formPassword = this.fb.group({
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    }, { validator: MustMatch('password', 'confirmPassword') });

  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  saveUserName(): void {
    this.authStore.dispatch(authActions.changeUserName(this.formUserName.getRawValue()));
    this.formUserName.markAsPristine();
    this.setIsFormsIsDirty();
  }

  showPasswordForm(): void {
    this.isPasswordFormDisplayed = true;
    this.unsavedChanges = true;
  }

  savePassword(): void {
    if (this.formPassword.invalid) {
      return;
    }
    this.authStore.dispatch(authActions.changePassword(this.formPassword.getRawValue()));
    this.authStore.select(authSelectors.selectIsLoadAfterActionSuccess)
      .pipe(
        takeUntil(this.subscription$),
        filter(res => Boolean(res))
      )
      .subscribe(() => {
        this.formPassword.reset();
        this.formPassword.markAsPristine();
        this.setIsFormsIsDirty();
        this.isPasswordFormDisplayed = false;
      });
  }

  setIsFormsIsDirty(): void {
    this.unsavedChanges = this.formUserName.dirty || this.formPassword.dirty;
  }

  canDeactivate(): Promise<boolean> {
    return this.settingsActionsService.openConfirmExitDialog();
  }
}
