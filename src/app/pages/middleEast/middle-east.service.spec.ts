import { TestBed } from '@angular/core/testing';

import { MiddleEastService } from './middle-east.service';

describe('MiddleEastService', () => {
  let service: MiddleEastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiddleEastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
