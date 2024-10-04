import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeworkService {
  private url = 'http://localhost:3001/api/homework';
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

  createHomework(studentId, dueDate, content): Observable<any> {
    content = content.replace(/"/g, "'");

    return this.http.post<any>(
      `${this.url}`,
      {
        studentId,
        dueDate,
        content,
      },
      {
        ...this.httpOptions,
        reportProgress: true,
      }
    );
  }

  getAllHomework(): Observable<any> {
    return this.http.get(`${this.url}`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }

  updateTaskStatus(id, done) {
    return this.http.put<any>(
      `${this.url}/${id}`,
      { done: done },
      {
        ...this.httpOptions,
        reportProgress: true,
      }
    );
  }

  deleteHomework(id) {
    return this.http.delete<any>(`${this.url}`, {
      ...this.httpOptions,
      reportProgress: true,
      body: { id },
    });
  }

  getHomeworkById(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${id}`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }
}
