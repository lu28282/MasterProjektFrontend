import { TestBed } from '@angular/core/testing';
import { CWEAPIService } from './cwe.service';


describe('CWEAPIService', () => {
  let service: CWEAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CWEAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});