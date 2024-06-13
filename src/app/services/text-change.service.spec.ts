import { TestBed } from '@angular/core/testing';

import { TextChangeService } from './text-change.service';

describe('TextChangeService', () => {
  let service: TextChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
