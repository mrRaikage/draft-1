import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { forgotPassword } from '../../store/auth.actions';
import { IAuthState } from '../../store/auth.reducer';
import { ModalInfoComponent } from '../../../shared/components/modal-info/modal-info.component';
import { constantModalInfo } from '../../../shared/constants/modal-info-constants';
import { ModalInfoInterface } from '../../../shared/interfaces/modal-info.interface';
import * as authSelectors from '../../store/auth.selectors';
import { validatorsPattern } from '../../../shared/utils/validators/validator-pattern';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [validatorsPattern.email, Validators.required])
  });
  spinnerStarted$: Observable<boolean> = this.authStore.select(authSelectors.selectIsSpinnerStarted);

  constructor(
    private authStore: Store<IAuthState>,
    private dialog: MatDialog
  ) {
  }

  sendForm(): void {
    if (this.form.invalid) {
      return;
    }
    this.authStore.dispatch(forgotPassword(this.form.getRawValue()));
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
