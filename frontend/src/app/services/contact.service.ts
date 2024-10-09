import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  url = 'http://localhost:3001/api/applications';
  constructor(private http: HttpClient) {}

  sendData(data) {
    const reqBody = {
      ...data,
      phoneNumber: data.phoneNumber.e164Number,
    };
    return this.http.post<any>(this.url, reqBody);
  }
}
