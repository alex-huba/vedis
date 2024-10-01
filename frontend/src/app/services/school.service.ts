import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private url = 'http://localhost:3001/api';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  // STUDENT Section
  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/students`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }

  deleteStudent(id) {
    return this.http.delete<any>(`${this.url}/students`, {
      ...this.httpOptions,
      reportProgress: true,
      body: { id },
    });
  }

  changeStudentRole(id, role) {
    return this.http.put<any>(
      `${this.url}/students`,
      { id, role },
      {
        ...this.httpOptions,
        reportProgress: true,
      }
    );
  }

}
