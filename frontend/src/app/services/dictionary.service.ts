import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  // private url = 'http://localhost:3001/api/dictionary';

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
      `${environment.apiUrl}/dictionary`,
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
    return this.http.get<any[]>(
      `${environment.apiUrl}/dictionary`,
      this.httpOptions
    );
  }

  getAmountById(studentId): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/dictionary/amount/${studentId}`,
      this.httpOptions
    );
  }

  deleteWord(id) {
    return this.http.delete<any>(`${environment.apiUrl}/dictionary`, {
      ...this.httpOptions,
      body: { id },
    });
  }

  getDictionaryById(id): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiUrl}/dictionary/${id}`,
      this.httpOptions
    );
  }
}
