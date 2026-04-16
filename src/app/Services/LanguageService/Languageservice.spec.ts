import { TestBed } from '@angular/core/testing';

import { Languageservice } from './Languageservice';

describe('Languageservice', () => {
  let service: Languageservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Languageservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
