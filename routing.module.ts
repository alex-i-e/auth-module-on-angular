import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninContainerComponent } from './containers/signin-container/signin-container.component';
import { PasswordResetContainerComponent } from './containers/password-reset-container/password-reset-container.component';
import { SignOutContainerComponent } from './containers/sign-out-container/sign-out-container.component';
import { ChangePasswordComponent } from './containers/change-password/change-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'login' },
  { path: 'login', component: SigninContainerComponent },
  { path: 'logout', component: SignOutContainerComponent },
  { path: 'password-reset', component: PasswordResetContainerComponent },
  { path: 'change-password', component: ChangePasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AuthRoutingModule {}
