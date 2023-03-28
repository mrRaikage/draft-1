import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';

import { IAuthState } from '../../store/auth.reducer';
import * as authActions from '../../store/auth.actions';
import * as authSelectors from '../../store/auth.selectors';
import { MustMatch } from '../../utils/validator';
import { ModalInfoComponent } from '../../../shared/components/modal-info/modal-info.component';
import { constantModalInfo } from '../../../shared/constants/modal-info-constants';
import { ModalInfoInterface } from '../../../shared/interfaces/modal-info.interface';
import { validatorsPattern } from "../../../shared/utils/validators/validator-pattern";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  form: FormGroup;
  hide = true;
  spinnerStarted$ = this.store.select(authSelectors.selectIsSpinnerStarted);
  googleSpinnerStarted$ = this.store.select(authSelectors.selectIsGoogleSpinnerStarted);

  constructor(
    private store: Store<IAuthState>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: new FormControl('', [validatorsPattern.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(8), Validators.required]),
      confirmPassword: new FormControl('', [Validators.minLength(8), Validators.required]),
    }, { validator: MustMatch('password', 'confirmPassword') });
  }

  sendForm(): void {
    if (this.form.invalid) {
      return;
    }
    this.store.dispatch(authActions.signUp(this.form.getRawValue()));
  }

  continueWithGoogle() {
    this.store.dispatch(authActions.signUpWithGoogle());
  }

  openModalInfo(name: string) {
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
