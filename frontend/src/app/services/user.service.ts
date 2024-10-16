import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  private photoUrlSubject = new BehaviorSubject<any>(null);
  photoUrl$ = this.photoUrlSubject.asObservable();

  // url = 'http://localhost:3001/api/user';

  // Update user data
  updateProfileData(data) {
    data.phoneNumber = data.phone.e164Number;
    return this.http.put<any>(`${environment.apiUrl}/user`, data);
  }

  uploadPhoto(photo) {
    return this.http.post<any>(`${environment.apiUrl}/user/photo`, photo);
  }

  getPhoto(userId) {
    return this.http
      .get(`${environment.apiUrl}/user/photo/${userId}`, {
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
    return this.http.delete(`${environment.apiUrl}/user/photo`);
  }
}
