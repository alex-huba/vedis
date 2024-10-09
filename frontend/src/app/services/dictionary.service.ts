import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  private url = 'http://localhost:3001/api/dictionary';

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
      `${this.url}`,
      {
        studentId,
        dueDate,
        word,
        transcription,
        translation,
      },
      {
        ...this.httpOptions,
      }
    );
  }

  getWholeDictionary(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}`, this.httpOptions);
  }

  getAmountById(studentId): Observable<any> {
    return this.http.get<any>(
      `${this.url}/amount/${studentId}`,
      this.httpOptions
    );
  }

  deleteWord(id) {
    return this.http.delete<any>(`${this.url}`, {
      ...this.httpOptions,
      body: { id },
    });
  }

  getDictionaryById(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${id}`, this.httpOptions);
  }
}
