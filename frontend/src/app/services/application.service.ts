import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private url = 'http://localhost:3001/api/applications';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getAllApplications() {
    return this.http.get(`${this.url}`, {
      ...this.httpOptions,
    });
  }

  countAllApplications() {
    return this.http.get<any>(`${this.url}/amount`, {
      ...this.httpOptions,
    });
  }

  deleteApplicationByEmail(email) {
    return this.http.delete(`${this.url}`, {
      ...this.httpOptions,
      body: {
        email: email,
      },
    });
  }
}
