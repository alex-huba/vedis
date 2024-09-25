import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeworkService {
  private url = 'http://localhost:3001/api';
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  countUnfinishedHomework() {
    return this.http.get<any>(`${this.url}/homework/unfinished/amount`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }
}
