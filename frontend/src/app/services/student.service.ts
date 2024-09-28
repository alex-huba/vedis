import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private url = 'http://localhost:3001/api/students';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getAllValidStudents(): Observable<any> {
    return this.http.get<any>(`${this.url}`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }

  getAllStudentUnfiltered() {
    return this.http.get(`${this.url}/unfiltered`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }

  deleteStudent(id) {
    return this.http.delete<any>(`${this.url}`, {
      ...this.httpOptions,
      reportProgress: true,
      body: { id: id },
    });
  }

  changeStudentRole(id, role) {
    return this.http.put<any>(
      `${this.url}`,
      { id, role },
      {
        ...this.httpOptions,
        reportProgress: true,
      }
    );
  }
}
