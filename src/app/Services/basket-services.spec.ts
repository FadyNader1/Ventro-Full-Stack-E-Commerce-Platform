import { TestBed } from '@angular/core/testing';

import { BasketServices } from './basket-services';

describe('BasketServices', () => {
  let service: BasketServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasketServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
