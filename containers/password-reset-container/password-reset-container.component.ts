import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppAuthService } from 'app-services';
import { CptInfoModalService } from 'app-components';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-password-reset-container',
  templateUrl: './password-reset-container.component.html',
  styleUrls: ['./password-reset-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetContainerComponent implements OnInit {
  validateForm: FormGroup;
  accountLocked: boolean;

  submitForm(): void {
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      this.authService
        .requestPasswordReset(this.validateForm.get('username').value)
        .pipe(map(value => value))
        .subscribe(value => {
          if (value.message) {
            this.modalService.error({
              title: 'Error',
              description: value.message,
              okClickHandler: () => {},
            });
          } else {
            this.modalService.success({
              title: 'Link sent',
              description: '',
              okClickHandler: () => {
                this.router.navigateByUrl('/auth/login').then(() => {});
              },
            });
          }
        });
    }
  }

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService: AppAuthService,
    private modalService: CptInfoModalService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required, Validators.email]],
    });
    this.accountLocked =
      this.activatedRoute.routeConfig.path === 'account-locked';

    this.activatedRoute.paramMap.pipe(first()).subscribe(data => {
      const { username } = window.history.state;
      this.validateForm.get('username').setValue(username);
    });
  }
}
