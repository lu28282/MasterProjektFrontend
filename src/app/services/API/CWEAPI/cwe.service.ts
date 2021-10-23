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

  // getCWEJsonSubscribe() {
  //   return this.http
  //     .get('http://localhost:8080/api/student/get')
  //     .pipe(take(1))
  //     .pipe(
  //       map((action) => {
  //         return this.getCWEVulability(action);
  //       })
  //     );
  // }

  getCWEJsonSubscribe(url: string) {
    let wholeUrl = 'http://localhost:8080/CWE?' + url;

    return this.http.get(wholeUrl, { responseType: 'text' as 'json' });
  //   return this.http.get(wholeUrl).pipe(map(action=>{
  //   const arr =[];
  //   console.log(action["2016-01"]);
    
  //   for (let index = 0; action[index]; index++) {
  //     const icweVulnerability = {
  //       date: new Date(action[index]),
  //       amount: currentArray[1],
  //     };
  //     arr.push(action[index]);

      
  //   }
  //   console.log('Jakob arr     ', arr);
  //   return arr;
    
  //   }));
  }
}
