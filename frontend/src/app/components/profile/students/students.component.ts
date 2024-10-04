import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit {
  students$: Observable<any>;

  constructor(
    private studentService: StudentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.students$ = this.studentService.getAllStudentUnfiltered();
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
}
