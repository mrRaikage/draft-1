import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { changePassword } from '../../store/auth.actions';
import { IAuthState } from '../../store/auth.reducer';
import { MustMatch } from '../../utils/validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  hide = true;

  constructor(
    private authStore: Store<IAuthState>,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      password: new FormControl('', [Validators.minLength(8), Validators.required]),
      confirmPassword: new FormControl('', [Validators.minLength(8), Validators.required])
    }, { validator: MustMatch('password', 'confirmPassword') });
  }

  sendForm(): void {
    if (this.form.invalid) {
      return;
    }
    this.authStore.dispatch(changePassword({
      confirmPassword: this.form.get('confirmPassword').value,
      navigateTo: 'auth/change-password-success'
    }));

  }

}
