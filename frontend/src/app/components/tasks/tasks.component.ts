import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SchoolService } from 'src/app/services/school.service';
import { HomeworkDetailsDialogComponent } from '../homework-details-dialog/homework-details-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  homework$: Observable<any>;
  isUserTeacher = false;
  awaitingResponse = false;

  constructor(
    private matDialog: MatDialog,
    private ss: SchoolService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.isUserTeacher = user.role === 'teacher';

      if (this.isUserTeacher) {
        this.homework$ = this.ss.getAllHomework();
      } else {
        this.homework$ = this.ss.getHomeworkById(user.id);
      }
    });
  }

  parseTimestamp(date: string) {
    const parsedDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: 'Europe/Kiev',
    };

    return parsedDate.toLocaleDateString('uk-UA', options);
  }

  openDialog(studentName, email, dueDate, status, content) {
    let dialogRef = this.matDialog.open(HomeworkDetailsDialogComponent, {
      data: { studentName, email, dueDate, status, content },
    });

    dialogRef.afterClosed().subscribe((res) => {});
  }

  deleteTask(id) {
    this.ss.deleteHomework(id).subscribe({
      next: (res) => {
        this.snackBar.open('Завдання видалено', '✅', {
          duration: 5000,
        });
        this.ngOnInit();
      },
      error: (err) => {
        this.snackBar.open('Щось пішло не так. Спробуйте ще раз', '❌', {
          duration: 5000,
        });
      },
    });
  }

  changeTaskStatus(id, status) {
    this.awaitingResponse = true;
    this.ss.updateTaskStatus(id, status).subscribe({
      next: (res) => {
        this.awaitingResponse = false;
        this.ngOnInit();
      }, 
      error: (err) => {
        this.awaitingResponse = false;
      }
    })
  }
}
