import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetContainerComponent } from './password-reset-container.component';

describe('PasswordResetContainerComponent', () => {
  let component: PasswordResetContainerComponent;
  let fixture: ComponentFixture<PasswordResetContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordResetContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
