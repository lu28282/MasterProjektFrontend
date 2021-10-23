import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ImpactScoreAPIService {
  constructor(private http: HttpClient) {}

  getImpactScore(url: string) {
    let wholeUrl = 'http://localhost:8080/impactScore?' + url;

    return this.http.get(wholeUrl, { responseType: 'text' as 'json' });
  }
}