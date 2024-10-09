import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LangTestService {
  private url = 'http://localhost:3001/api/test';
  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private options = {
    ...this.httpOptions,
  };

  constructor(private http: HttpClient) {}

  checkLvl(answers, lang) {
    const req = new HttpRequest(
      'POST',
      `${this.url}/${lang}`,
      { answers: answers },
      this.options
    );
    return this.http.request(req);
  }
}
