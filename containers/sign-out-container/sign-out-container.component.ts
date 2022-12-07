import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppAuthService } from 'app-services';
import { Router } from '@angular/router';
import { take, tap } from 'rxjs/operators';
import { AppSessionStore } from 'shared/state/session/session.store';

@Component({
  selector: 'app-sign-out-container',
  templateUrl: './sign-out-container.component.html',
  styleUrls: ['./sign-out-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignOutContainerComponent implements OnInit {
  constructor(
    private authService: AppAuthService,
    private sessionStore: AppSessionStore,
    private router: Router,
  ) {}

  ngOnInit() {
    this.authService
      .logOut()
      .pipe(tap(() => this.sessionStore.endSession()))
      .pipe(take(1))
      .subscribe(() => this.router.navigate(['/']));
  }
}
