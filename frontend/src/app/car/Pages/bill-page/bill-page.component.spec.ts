import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillPageComponent } from './bill-page.component';

describe('BillPageComponent', () => {
  let component: BillPageComponent;
  let fixture: ComponentFixture<BillPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BillPageComponent]
    });
    fixture = TestBed.createComponent(BillPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
