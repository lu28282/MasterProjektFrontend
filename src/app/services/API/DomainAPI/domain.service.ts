import { IDomains } from './../../../interfaces/domains';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DomainAPIService {
  domainsFromCSV$: Observable<IDomains[]> | undefined;

  constructor(private http: HttpClient) {}

  getDomains() {
    //this.domainsFromCSV$=this.readCsvData();
    //return this.domainsFromCSV$;

    this.http
      .get('./assets/tld2.csv', { responseType: 'text' as 'json' })
      .subscribe((data) => {
        let csvRecordsArray = data.toString().split(/\r\n|\n/);
        this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
      });
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let currentRecord = csvRecordsArray[i].split(';');

      const iDomains = {
        land: currentRecord[0],
        domain: currentRecord[1],
      };

      csvArr.push(iDomains);
    }

    return csvArr;
  }
}
