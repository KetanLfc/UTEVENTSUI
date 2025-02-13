import { TestBed } from '@angular/core/testing';

import { AllowedEventRoleService } from './allowed-event-role.service';

describe('AllowedEventRoleService', () => {
  let service: AllowedEventRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllowedEventRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
