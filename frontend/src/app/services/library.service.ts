import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  // baseUrl = 'http://localhost:3001/api/library';

  constructor(private http: HttpClient) {}

  getCountOfFiles() {
    return this.http.get(`${environment.apiUrl}/library`);
  }

  getFileNamesByStudentId(studentId) {
    return this.http.get(`${environment.apiUrl}/library/${studentId}`);
  }

  deleteFileByName(fileName, studentId) {
    return this.http.delete(
      `${environment.apiUrl}/library/${studentId}/${fileName}`
    );
  }

  uploadFile(formData, studentId) {
    return this.http.post<any>(
      `${environment.apiUrl}/library/${studentId}`,
      formData
    );
  }
}
