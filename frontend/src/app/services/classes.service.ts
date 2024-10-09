import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClassesService {
  private url = 'http://localhost:3001/api/classes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  countClassesForCurrentWeek(userId) {
    return this.http.get<any>(
      `${this.url}/current/week/amount/${userId}`,
      this.httpOptions
    );
  }

  getAllClasses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}`, this.httpOptions);
  }

  getAllRecentClasses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/recent`, this.httpOptions);
  }

  getAllClassesForToday(userId): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.url}/today/${userId}`,
      this.httpOptions
    );
  }

  getClassesById(studentId): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${studentId}`, this.httpOptions);
  }

  createClass(studentId, start, end, price): Observable<any> {
    return this.http.post<any>(
      `${this.url}`,
      { studentId, start, end, price },
      this.httpOptions
    );
  }

  deleteClass(id) {
    return this.http.delete<any>(`${this.url}`, {
      ...this.httpOptions,
      body: { id },
    });
  }

  updateStatus(id, status) {
    return this.http.put<any>(
      `${this.url}/${id}/cancellation`,
      {
        isCancelled: status,
      },
      this.httpOptions
    );
  }

  updatePaymentStatus(id, isPaid) {
    return this.http.put<any>(
      `${this.url}/${id}/payment`,
      {
        isPaid,
      },
      this.httpOptions
    );
  }
}
