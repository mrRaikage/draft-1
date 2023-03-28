import { Component } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';

import * as authActions from '../../store/auth.actions';
import * as authSelectors from '../../store/auth.selectors';
import { IAuthState } from '../../store/auth.reducer';
import { ModalInfoComponent } from '../../../shared/components/modal-info/modal-info.component';
import { constantModalInfo } from '../../../shared/constants/modal-info-constants';
import { ModalInfoInterface } from '../../../shared/interfaces/modal-info.interface';
import { validatorsPattern } from '../../../shared/utils/validators/validator-pattern';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, validatorsPattern.email]),
    password: new FormControl('', [Validators.minLength(8), Validators.required]),
  });
  hide = true;
  spinnerStarted$ = this.store.select(authSelectors.selectIsSpinnerStarted);
  googleSpinnerStarted$ = this.store.select(authSelectors.selectIsGoogleSpinnerStarted);

  constructor(
    private store: Store<IAuthState>,
    private dialog: MatDialog
  ) {}

  sendForm(): void {
    if (this.form.invalid) {
      return;
    }
    this.store.dispatch(authActions.signIn(this.form.getRawValue()));
  }

  signInWithGoogle(): void {
    this.store.dispatch(authActions.signInWithGoogle());
  }

  getErrorMessage(controlName: string): ValidationErrors {
    return this.form.get(controlName).errors;

  }

  openModalInfo(name: string): void {
    this.dialog.open(ModalInfoComponent, {
      height: '554px',
      width: '470px',
      data: {
        title: constantModalInfo[name].title,
        text: constantModalInfo[name].text
      } as ModalInfoInterface
    });
  }
}
