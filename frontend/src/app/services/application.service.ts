import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  // private url = 'http://localhost:3001/api/applications';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getAllApplications() {
    return this.http.get(`${environment.apiUrl}/applications`, {
      ...this.httpOptions,
    });
  }

  countAllApplications() {
    return this.http.get<any>(`${environment.apiUrl}/applications/amount`, {
      ...this.httpOptions,
    });
  }

  deleteApplicationByEmail(email) {
    return this.http.delete(`${environment.apiUrl}/applications`, {
      ...this.httpOptions,
      body: {
        email: email,
      },
    });
  }
}
