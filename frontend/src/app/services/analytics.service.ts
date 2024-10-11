import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  // private url = 'http://localhost:3001/api/analytics';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  generateMonthlyRevenueReport(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/analytics`, this.httpOptions);
  }
}
