import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './services/auth.service';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthComponent } from './auth.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { ForgotPasswordSuccessComponent } from './components/forgot-password-success/forgot-password-success.component';
import { ChangePasswordSuccessComponent } from './components/change-password-success/change-password-success.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    AuthComponent,
    ForgotPasswordSuccessComponent,
    ChangePasswordSuccessComponent
  ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        MatFormFieldModule,
        MatCardModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatInputModule,
        MatProgressSpinnerModule,
        SharedModule,
    ],
  providers: [
    AuthService
  ],
})
export class AuthModule {
}
