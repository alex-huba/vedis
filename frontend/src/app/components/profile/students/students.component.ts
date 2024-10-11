import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, map, Observable, of } from 'rxjs';
import { StudentService } from 'src/app/services/student.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit {
  students$: Observable<any>;

  areStudentsLoaded = false;

  // url = 'http://localhost:3001/api/user';

  constructor(
    private studentService: StudentService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.studentService.getAllStudentUnfiltered().subscribe((arr) => {
      if (arr) {
        arr.forEach((student) => {
          this.getPhoto(student.id).subscribe((photoUrl) => {
            student.photoUrl = photoUrl;
          });
        });
        // Assign the modified array with the photo URLs back to the students$ observable
        this.students$ = of(arr); // Create a new Observable with the modified array
        this.areStudentsLoaded = true;
      }
    });
  }

  delete(id) {
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.ngOnInit();
        this.snackBar.open('Учня видалено', '👍', {
          duration: 5000,
        });
      },
      error: () => {
        this.snackBar.open('Помилка. Спробуйте ще раз', '👍', {
          duration: 5000,
        });
      },
    });
  }

  changeRole(id) {
    this.studentService.changeStudentRole(id, 'student').subscribe({
      next: () => {
        this.ngOnInit();
        this.snackBar.open('Статус учня змінено', '👍', {
          duration: 5000,
        });
      },
      error: () => {
        this.snackBar.open('Помилка. Спробуйте ще раз', '👍', {
          duration: 5000,
        });
      },
    });
  }

  getPhoto(userId: string): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/user/photo/${userId}`, {
        responseType: 'blob',
      })
      .pipe(
        map((photoBlob) => {
          const objectUrl = URL.createObjectURL(photoBlob);
          return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        }),
        catchError(() => of(null))
      );
  }
}
