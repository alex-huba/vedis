import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContactInfo } from '../models/contact-info';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private http: HttpClient) {}

  // sendData(data: ContactInfo) {
  //   return this.http.post<ContactInfo>(this.config.baseUrl, data);
  // }

  sendData(data: ContactInfo) {
    return new BehaviorSubject<any>(null);
  }
}
