import { ICWE } from './../../../interfaces/cwe';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CWEAPIService {
  iCWE: ICWE[];
  subscribe: Subscription;
  cweFromJson$: Observable<ICWE[]>;

  constructor(private http: HttpClient) {}

  getCWEVulability(cweVulabilityArray: any) {
    let cweArr = [];

    for (let i = 0; i < cweVulabilityArray.length; i++) {
      let currentCWE = cweVulabilityArray[i];

      const ICWE: ICWE = {
        cwe: currentCWE,
      };

      cweArr.push(ICWE);
    }

    return cweArr;
  }

  getCWEJsonSubscribe() {
    return this.http
      .get('http://localhost:8080/api/student/get')
      .pipe(take(1))
      .pipe(
        map((action) => {
          return this.getCWEVulability(action);
        })
      );
  }
}
