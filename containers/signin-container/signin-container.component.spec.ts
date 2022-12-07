import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninContainerComponent } from './signin-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CptElementsModule } from 'app-components';
import { AppSessionStateService } from 'shared/state/session/session.service';
import { AppAuthService } from 'app-services';
import { AppSessionStore } from 'shared/state/session/session.store';

describe('SigninContainerComponent', () => {
  let component: SigninContainerComponent;
  let fixture: ComponentFixture<SigninContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SigninContainerComponent],
      imports: [RouterTestingModule, ReactiveFormsModule, CptElementsModule],
      providers: [AppSessionStateService, AppSessionStore, AppAuthService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
