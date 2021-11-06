import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CWEAPIService {
  subscribe: Subscription;

  constructor(private http: HttpClient) {}

  getCWE(url: string) {
    let wholeUrl = 'http://localhost:8080/CWE?' + url;

    return this.http.get(wholeUrl, { responseType: 'text' as 'json' });
  }
}
