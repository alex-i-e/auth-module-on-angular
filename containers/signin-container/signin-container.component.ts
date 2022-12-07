import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AuthorizationCode,
  AuthorizationResult,
  AppAuthService,
} from 'app-services';
import { CptInfoModalService, CptSpinnerService } from 'app-components';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AppSessionStateService } from 'shared/state/session/session.service';
import { FormService } from 'shared/service/form.service';
import { UtilService } from 'shared/service/util.service';
import { appSettings } from '../../../../app.settings';
import { STATE_ROUTES } from '../../../features/_features-root/features-container.component';

interface SingInContainerFields {
  username: string;
  password: string;
}

@Component({
  selector: 'app-signin-container',
  templateUrl: './signin-container.component.html',
  styleUrls: ['./signin-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninContainerComponent implements OnInit {
  singInForm: FormGroup;
  rememberFlag: boolean;

  signInContainerFields: SingInContainerFields = {
    username: null,
    password: null,
  };

  formErrors = {
    username: '',
    password: '',
  };

  validationMessages = {
    username: {
      required: 'This field is required',
      email: 'Please use valid email',
      pattern: `Please, enter @${appSettings.DOMAIN} domain `,
    },
    password: {
      required: 'This field is required',
    },
  };

  constructor(
    private authService: AppAuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: CptInfoModalService,
    protected sessionStateService: AppSessionStateService,
    private formService: FormService,
    private utilService: UtilService,
    private spinner: CptSpinnerService,
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  navigateWithState() {
    const username = this.singInForm.controls.username.value;
    this.router
      .navigateByUrl('/auth/password-reset', { state: { username } })
      .then(() => {});
  }

  get isFormValid() {
    return this.singInForm.status === 'VALID';
  }

  private buildForm(): void {
    this.singInForm = this.formBuilder.group({
      username: [
        this.signInContainerFields.username,
        [
          Validators.email,
          Validators.required,
          Validators.pattern(this.utilService.emailRegExp(appSettings.DOMAIN)),
        ],
      ],
      password: [this.signInContainerFields.password, [Validators.required]],
    });
    this.singInForm.valueChanges.subscribe(() =>
      this.formService.onValueChanged({
        form: this.singInForm,
        errors: this.formErrors,
        messages: this.validationMessages,
      }),
    );
  }

  login() {
    if (this.singInForm.status === 'VALID') {
      this.spinner.show();
      this.authService
        .login(this.singInForm.value)
        .pipe(take(1) as any)
        .subscribe((res: AuthorizationResult) => {
          this.handleLoginResponse(res);
          this.spinner.hide();
        });
    } else {
      this.formService.onValueChanged(
        {
          form: this.singInForm,
          errors: this.formErrors,
          messages: this.validationMessages,
        },
        true,
      );
    }
  }

  rememberMeChecked(value) {
    this.rememberFlag = value;
  }

  private handleLoginResponse(res: AuthorizationResult) {
    if (!res) {
      return;
    }
    switch (res.status) {
      case AuthorizationCode.Failed:
        this.modalService.error({
          title: 'Login Error',
          description: res.user.message,
          okClickHandler: () => {},
        });
        break;
      case AuthorizationCode.PasswordChangeChallenge:
        // TODO: add challenge component or modal
        // if there are any other user details that need to be provided,
        // discover them through user.challengeParam.requiredAttributes
        const { requiredAttributes } = res.user.challengeParam;
        console.warn('Challenge', requiredAttributes);
        this.handlePostLogin(res);
        this.router
          .navigateByUrl('/auth/change-password', {
            state: { isPasswordChangeChallenge: true },
          })
          .then(() => {});
        break;
      case AuthorizationCode.Success:
        this.handlePostLogin(res);
        break;
    }
  }

  private handlePostLogin(res: AuthorizationResult) {
    const persist = this.rememberFlag;
    this.sessionStateService.start(res.user, persist);
    this.router
      .navigateByUrl('/', { state: { route: STATE_ROUTES.Auth } })
      .then(() => {});
  }
}
