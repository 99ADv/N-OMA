import { TestBed } from '@angular/core/testing';

import { HelperDevService } from './helper-dev.service';

describe('HelperDevService', () => {
  let service: HelperDevService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelperDevService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
