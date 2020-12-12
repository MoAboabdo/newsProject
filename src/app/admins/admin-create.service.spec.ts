import { TestBed } from '@angular/core/testing';

import { AdminCreateService } from './admin-create.service';

describe('AdminCreateService', () => {
  let service: AdminCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
