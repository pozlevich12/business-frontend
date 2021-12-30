import { TestBed } from '@angular/core/testing';

import { CreateAdService } from './create-ad.service';

describe('CreateAdService', () => {
  let service: CreateAdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateAdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
