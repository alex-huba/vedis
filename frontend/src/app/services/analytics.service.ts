import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private url = 'http://localhost:3001/api';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  generateMonthlyRevenueReport(): Observable<any> {
    return this.http.get<any>(`${this.url}/analytics`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }
}
