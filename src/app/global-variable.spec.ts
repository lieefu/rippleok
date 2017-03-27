/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GlobalVariable } from './global-variable';

describe('GlobalVariable', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalVariable]
    });
  });

  it('should ...', inject([GlobalVariable], (service: GlobalVariable) => {
    expect(service).toBeTruthy();
  }));
});
