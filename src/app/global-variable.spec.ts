/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GlobalVariable } from './global-variable';

describe('GlobalVariable', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalVariableService]
    });
  });

  it('should ...', inject([GlobalVariableService], (service: GlobalVariable) => {
    expect(service).toBeTruthy();
  }));
});
