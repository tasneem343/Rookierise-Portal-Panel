import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Setpasswordpage } from './setpasswordpage';

describe('Setpasswordpage', () => {
  let component: Setpasswordpage;
  let fixture: ComponentFixture<Setpasswordpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Setpasswordpage],
    }).compileComponents();

    fixture = TestBed.createComponent(Setpasswordpage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
