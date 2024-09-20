import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { SchoolService } from 'src/app/services/school.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit {
  students$: Observable<any>;

  constructor(private ss: SchoolService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.students$ = this.ss.getStudentsUnfiltered();
  }

  delete(id) {
    this.ss.deleteStudent(id).subscribe({
      next: (res) => {
        this.ngOnInit();
        this.snackBar.open('Учня видалено', '✅', {
          duration: 5000,
        });
      },
      error: (err) => {
        this.snackBar.open('Щось пішло не так. Спробуйте ще раз', '❌', {
          duration: 5000,
        });
      },
    });
  }

  changeRole(id) {
    this.ss.changeStudentRole(id, 'student').subscribe({
      next: (res) => {
        this.ngOnInit();
        this.snackBar.open('Статус учня змінено', '✅', {
          duration: 5000,
        });
      },
      error: (err) => {
        this.snackBar.open('Щось пішло не так. Спробуйте ще раз', '❌', {
          duration: 5000,
        });
      },
    });
  }
}
