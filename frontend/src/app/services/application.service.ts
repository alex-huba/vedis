import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private url = 'http://localhost:3001/api';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getAllApplications() {
    return this.http.get(`${this.url}/applications`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }

  countAllApplications() {
    return this.http.get<any>(`${this.url}/applications/amount`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }

  deleteApplicationByEmail(email) {
    return this.http.delete(`${this.url}/applications`, {
      ...this.httpOptions,
      reportProgress: true,
      body: {
        email: email,
      },
    });
  }
}
