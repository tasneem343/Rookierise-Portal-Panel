import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Setpassword } from './setpassword';

describe('Setpassword', () => {
  let component: Setpassword;
  let fixture: ComponentFixture<Setpassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Setpassword],
    }).compileComponents();

    fixture = TestBed.createComponent(Setpassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
