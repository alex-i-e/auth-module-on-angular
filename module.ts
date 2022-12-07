import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './routing.module';
import { SigninContainerComponent } from './containers/signin-container/signin-container.component';
import { CptElementsModule, CptInfoModalComponent } from 'app-components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppAuthModule, AppUsersService } from 'app-services';
import { SignOutContainerComponent } from './containers/sign-out-container/sign-out-container.component';
import { PasswordResetContainerComponent } from './containers/password-reset-container/password-reset-container.component';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './containers/auth-layout/auth-layout.component';
import { ChangePasswordComponent } from './containers/change-password/change-password.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AppAuthModule,
    CptElementsModule,
  ],
  declarations: [
    SigninContainerComponent,
    SignOutContainerComponent,
    PasswordResetContainerComponent,
    AuthLayoutComponent,
    ChangePasswordComponent,
  ],
  providers: [AppUsersService],
  entryComponents: [CptInfoModalComponent],
})
export class AuthModule {}
