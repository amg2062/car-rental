import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadCarsComponent } from './load-cars.component';

describe('LoadCarsComponent', () => {
  let component: LoadCarsComponent;
  let fixture: ComponentFixture<LoadCarsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadCarsComponent]
    });
    fixture = TestBed.createComponent(LoadCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
