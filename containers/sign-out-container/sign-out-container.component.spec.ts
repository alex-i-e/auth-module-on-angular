import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOutContainerComponent } from './sign-out-container.component';
import { AppAuthService } from 'app-services';
import { AppSessionStore } from 'shared/state/session/session.store';
import { RouterTestingModule } from '@angular/router/testing';

describe('SignOutContainerComponent', () => {
  let component: SignOutContainerComponent;
  let fixture: ComponentFixture<SignOutContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignOutContainerComponent],
      imports: [RouterTestingModule],
      providers: [AppAuthService, AppSessionStore],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignOutContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
