import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  private photoUrlSubject = new BehaviorSubject<any>(null);
  // Observable for components to subscribe to
  photoUrl$ = this.photoUrlSubject.asObservable();

  url = 'http://localhost:3001/api/user';

  // Update user data
  sendData(data) {
    data.phoneNumber = data.phone.e164Number;
    return this.http.put<any>('http://localhost:3001/api/user', data);
  }

  uploadPhoto(photo) {
    return this.http.post<any>(`${this.url}/photo`, photo);
  }

  getPhoto() {
    return this.http
      .get(`${this.url}/photo`, {
        responseType: 'blob',
      })
      .subscribe({
        next: (photoBlob) => {
          const objectUrl = URL.createObjectURL(photoBlob);
          const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          // Broadcast the new photo URL
          this.photoUrlSubject.next(sanitizedUrl);
        },
        error: () => this.photoUrlSubject.next(null),
      });
  }

  deletePhoto() {
    return this.http.delete(`${this.url}/photo`);
  }
}
