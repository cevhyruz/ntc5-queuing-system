import { TestBed } from '@angular/core/testing';

import { PstService } from './pst.service';

describe('PstService', () => {
  let service: PstService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PstService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
