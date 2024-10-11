import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  // url = 'http://localhost:3001/api/applications';
  constructor(private http: HttpClient) {}

  sendData(data) {
    const reqBody = {
      ...data,
      phoneNumber: data.phoneNumber.e164Number,
    };
    return this.http.post<any>(`${environment.apiUrl}/applications`, reqBody);
  }
}
