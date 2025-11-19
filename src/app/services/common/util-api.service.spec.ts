import { TestBed } from '@angular/core/testing';

import { UtilApiService } from './util-api.service';

describe('UtilApiService', () => {
  let service: UtilApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
