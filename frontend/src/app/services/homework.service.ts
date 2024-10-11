import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomeworkService {
  // private url = 'http://localhost:3001/api/homework';
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  countUnfinishedHomework(userId) {
    return this.http.get<any>(
      `${environment.apiUrl}/homework/unfinished/amount/${userId}`,
      this.httpOptions
    );
  }

  createHomework(studentId, dueDate, content): Observable<any> {
    content = content.replace(/"/g, "'");

    return this.http.post<any>(
      `${environment.apiUrl}/homework`,
      {
        studentId,
        dueDate,
        content,
      },
      this.httpOptions
    );
  }

  getAllHomework(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/homework`, this.httpOptions);
  }

  updateTaskStatus(id, done) {
    return this.http.put<any>(
      `${environment.apiUrl}/homework/${id}`,
      { done: done },
      this.httpOptions
    );
  }

  deleteHomework(id) {
    return this.http.delete<any>(`${environment.apiUrl}/homework`, {
      ...this.httpOptions,
      body: { id },
    });
  }

  getHomeworkById(id): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiUrl}/homework/${id}`,
      this.httpOptions
    );
  }
}
