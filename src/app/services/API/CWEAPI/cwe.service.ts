import { ICWE } from './../../../interfaces/cwe';
import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription} from 'rxjs';
// import { interval } from 'rxjs';

// import 'rxjs/add/Observable/interval';
// import 'rxjs/add/operators/mergeMap';
// import 'rxjs/add/operators/takeWhile';

@Injectable({
  providedIn: 'root',
})
export class CWEAPIService{
  iCWE: ICWE[];
  subscribe: Subscription;
  // mySub: Subscription;

  constructor(private http: HttpClient) {}
 

  getCWE() {
  //this.getJsonSubscribe();
  this.getHTTP();
 

    // this.http
    //   .get('./assets/cwe.json')

    //   .subscribe((data) => {
    //     console.log("api "+ data);
        
    //     this.iCWE = this.getCWEVulability(data);
    //   }).unsubscribe();

   

    return this.iCWE;
  }

  getCWEVulability(cweVulabilityArray: any) {
    let cweArr = [];

    for (let i = 0; i < cweVulabilityArray['vul'].length; i++) {
      let currentCWE = cweVulabilityArray['vul'][i];

      const ICWE: ICWE = {
        cwe: currentCWE,
      };

      cweArr.push(ICWE);
    }
    //this.unscribeJson();

    return cweArr;
  }

  // waitCWE() {
  //   this.mySub = timer(3000, 10000000000000).subscribe((func) => {
  //     console.log('yess');

  //     this.getCWE();
  //   });
  //   return this.iCWE;
  // }

  getJsonSubscribe(){
    this.subscribe= this.http
    .get('./assets/cwe.json')

    .subscribe((data) => {
      console.log("api "+ data);
      
      this.iCWE = this.getCWEVulability(data);
      
    });
    
  }
  unscribeJson(){
    this.subscribe.unsubscribe();
  }

  getHTTP()  {
    //hit the api and get josn string or error
    return this.http.get("C:\Users\barto\Downloads\cwe.json").forEach(element => {
      console.log("Hier bin ich");
      this.iCWE = this.getCWEVulability(element);
      
      console.log(element);
      
    });

}
}
