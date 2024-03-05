import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDialogComponentComponent } from './notification-dialog-component.component';

describe('NotificationDialogComponentComponent', () => {
  let component: NotificationDialogComponentComponent;
  let fixture: ComponentFixture<NotificationDialogComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationDialogComponentComponent]
    });
    fixture = TestBed.createComponent(NotificationDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
