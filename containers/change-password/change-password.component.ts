import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthorizationCode,
  AuthorizationResult,
  AppAuthService,
  AppUsersService,
} from 'app-services';
import { CptInfoModalService, CptSpinnerService } from 'app-components';
import { first } from 'rxjs/operators';
import { FormService } from 'shared/service/form.service';
import { AppSessionStateService } from 'shared/state/session/session.service';
import { STATE_ROUTES } from '../../../features/_features-root/features-container.component';

const SUCCESS_ICON_PATH = './assets/icons/check.png';
const ERROR_ICON_PATH = './assets/icons/close.png';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  public validateForm: FormGroup;
  public passwordType = 'password';
  public isPasswordChangeChallenge: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AppAuthService,
    private spinner: CptSpinnerService,
    private formService: FormService,
    protected sessionStateService: AppSessionStateService,
    private modalService: CptInfoModalService,
    protected usersService: AppUsersService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      oldPassword: [''],
      password: ['', [Validators.required, this.validatePassword]],
      confirmedPassword: ['', [Validators.required, this.validateMatching]],
    });

    this.activatedRoute.paramMap.pipe(first()).subscribe(data => {
      this.isPasswordChangeChallenge =
        window.history.state.isPasswordChangeChallenge;

      if (!this.isPasswordChangeChallenge) {
        this.validateForm.get('oldPassword').setValidators(Validators.required);
      }
    });
  }

  validateMatching(control: AbstractControl) {
    const validateForm = control.parent;
    if (!validateForm) {
      return null;
    }

    const passwordControl = validateForm.get('password').value;
    const confirmedPasswordControl = validateForm.get('confirmedPassword')
      .value;

    return passwordControl !== confirmedPasswordControl
      ? { notConfirmed: true }
      : null;
  }

  get isFormValid() {
    return this.validateForm.status === 'VALID';
  }

  validatePassword(control: AbstractControl) {
    const length = control.value.length < 8;
    const special = !/.*[!@#$%^&*(),.?":{}|<>]+.*/.test(control.value);
    const digits = !/.*[0-9]+.*/.test(control.value);
    const upper = !/.*[A-Z]+.*/.test(control.value);
    const lower = !/.*[a-z]+.*/.test(control.value);
    if (!length && !special && !digits && !upper && !lower) {
      return null;
    }
    return {
      length,
      special,
      digits,
      upper,
      lower,
    };
  }

  checkOnPasswordError(code: string): string {
    const password = this.validateForm.get('password');
    if (password.errors) {
      return password.errors[code] ? ERROR_ICON_PATH : SUCCESS_ICON_PATH;
    }
    return SUCCESS_ICON_PATH;
  }

  submitForm() {
    const password = this.validateForm.get('password').value;

    this.spinner.show();
    this.authService
      .completePasswordChallenge({
        newPassword: password,
        attributes: {},
      })
      .pipe(first())
      .subscribe({
        next: (res: AuthorizationResult) => {
          this.sessionStateService.start(res.user, false);
          this.handleChangePasswordResponse(res);
        },
        complete: () => {
          this.spinner.hide();
        },
      });
  }

  passwordOnChange(ev) {
    this.validateForm.get('confirmedPassword').updateValueAndValidity();
  }

  private isPasswordMatched() {
    return (
      this.validateForm.get('password').value ===
      this.validateForm.get('confirmedPassword').value
    );
  }

  private handleChangePasswordResponse(res: AuthorizationResult) {
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
      case AuthorizationCode.Success:
        this.handlePostChangePassword(res);
        break;
    }
  }

  private handlePostChangePassword(res: AuthorizationResult) {
    this.sessionStateService.start(res.user, false);
    this.router
      .navigateByUrl('/', { state: { route: STATE_ROUTES.Auth } })
      .then(() => {});
  }
}
