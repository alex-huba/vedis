import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClassesService {
  private url = 'http://localhost:3001/api';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  countClassesForCurrentWeek() {
    return this.http.get<any>(`${this.url}/classes/current-week/amount`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }

  createClass(studentId, start, end, price): Observable<any> {
    return this.http.post<any>(
      `${this.url}/classes`,
      { studentId, start, end, price },
      {
        ...this.httpOptions,
        reportProgress: true,
      }
    );
  }
}
