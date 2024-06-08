import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SingleCarPage } from './single-car.page';

describe('SingleCarPage', () => {
  let component: SingleCarPage;
  let fixture: ComponentFixture<SingleCarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleCarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
