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

  getAllClasses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/classes`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }

  getClassesById(studentId): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/classes/${studentId}`, {
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

  deleteClass(id) {
    return this.http.delete<any>(`${this.url}/classes`, {
      ...this.httpOptions,
      reportProgress: true,
      body: { id },
    });
  }

  updateClass(
    id,
    cancelled,
    studentId,
    start,
    end,
    price,
    isPaid,
    studentTimezone
  ) {
    start = `${start}:00${studentTimezone}`;
    end = `${end}:00${studentTimezone}`;

    return this.http.put<any>(
      `${this.url}/classes/${id}`,
      { cancelled, studentId, start, end, price, isPaid },
      {
        ...this.httpOptions,
        reportProgress: true,
      }
    );
  }

  updateStatus(id, status) {
    return this.http.put<any>(
      `${this.url}/classes/${id}/cancellation`,
      {
        isCancelled: status,
      },
      {
        ...this.httpOptions,
        reportProgress: true,
      }
    );
  }

  updatePaymentStatus(id, isPaid) {
    return this.http.put<any>(
      `${this.url}/classes/${id}/payment`,
      {
        isPaid,
      },
      {
        ...this.httpOptions,
        reportProgress: true,
      }
    );
  }
}
