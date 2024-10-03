import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  baseUrl = 'http://localhost:3001/api/library';

  constructor(private http: HttpClient) {}

  getCountOfFiles() {
    return this.http.get(this.baseUrl);
  }

  getFileNamesByStudentId(studentId) {
    return this.http.get(`${this.baseUrl}/${studentId}`);
  }

  deleteFileByName(fileName, studentId) {
    return this.http.delete(`${this.baseUrl}/${studentId}/${fileName}`);
  }

  uploadFile(formData, studentId) {
    return this.http.post<any>(`${this.baseUrl}/${studentId}`, formData);
  }
}
