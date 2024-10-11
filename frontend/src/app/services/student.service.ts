import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  // private url = 'http://localhost:3001/api/students';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getAllValidStudents(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/students`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }

  getAllStudentUnfiltered() {
    return this.http.get<any>(`${environment.apiUrl}/students/unfiltered`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }

  deleteStudent(id) {
    return this.http.delete<any>(`${environment.apiUrl}/students`, {
      ...this.httpOptions,
      reportProgress: true,
      body: { id: id },
    });
  }

  changeStudentRole(id, role) {
    return this.http.put<any>(
      `${environment.apiUrl}/students`,
      { id, role },
      {
        ...this.httpOptions,
        reportProgress: true,
      }
    );
  }
}
