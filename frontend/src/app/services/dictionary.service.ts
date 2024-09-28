import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  private url = 'http://localhost:3001/api';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  createWord(
    studentId,
    dueDate,
    word,
    transcription,
    translation
  ): Observable<any> {
    return this.http.post<any>(
      `${this.url}/dictionary`,
      {
        studentId,
        dueDate,
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

  getDictionaryById(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/dictionary/${id}`, {
      ...this.httpOptions,
      reportProgress: true,
    });
  }
}
