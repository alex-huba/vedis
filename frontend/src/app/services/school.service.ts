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

  // CLASS Section
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

  createClass(studentId, studentName, start, end): Observable<any> {
    return this.http.post<any>(
      `${this.url}/classes`,
      { studentId, studentName, start, end },
      {
        ...this.httpOptions,
        reportProgress: true,
      }
    );
  }

  updateClass(id, status, studentId, start, end) {
    return this.http.put<any>(
      `${this.url}/classes/update`,
      { id, status, studentId, start, end },
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

  // HOMEWORK Section
  createHomework(
    studentId,
    date,
    status,
    content,
    studentName
  ): Observable<any> {
    return this.http.post<any>(
      `${this.url}/homework`,
      {
        studentId,
        date,
        status,
        content,
        studentName,
      },
      {
        ...this.httpOptions,
        reportProgress: true,
      }
    );
  }

  getAllHomework(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/homework`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }

  getHomeworkById(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/homework/${id}`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }

  deleteHomework(id) {
    return this.http.delete<any>(`${this.url}/homework`, {
      ...this.httpOptions,
      reportProgress: true,
      body: { id },
    });
  }

  updateTaskStatus(id, status) {
    return this.http.put<any>(
      `${this.url}/homework/${id}`,
      { status },
      {
        ...this.httpOptions,
        reportProgress: true,
      }
    );
  }

  // DICTIONARY Section
  createWord(
    studentId,
    date,
    word,
    transcription,
    translation
  ): Observable<any> {
    return this.http.post<any>(
      `${this.url}/dictionary`,
      {
        studentId,
        date,
        word,
        transcription,
        translation,
      },
      {
        ...this.httpOptions,
        reportProgress: true,
      }
    );
  }

  getDictionaryById(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/dictionary/${id}`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }

  getWholeDictionary(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/dictionary`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }

  deleteWord(id) {
    return this.http.delete<any>(`${this.url}/dictionary`, {
      ...this.httpOptions,
      reportProgress: true,
      body: { id },
    });
  }
}
