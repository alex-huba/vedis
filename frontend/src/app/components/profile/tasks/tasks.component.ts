import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SchoolService } from 'src/app/services/school.service';
import { HomeworkDetailsDialogComponent } from '../homework-details-dialog/homework-details-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { HomeworkService } from 'src/app/services/homework.service';

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
    private authService: AuthService,
    private homeworkService: HomeworkService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.isUserTeacher = user.role === 'teacher';

      if (this.isUserTeacher) {
        this.homework$ = this.homeworkService.getAllHomework();
      } else {
        this.homework$ = this.homeworkService.getHomeworkById(user.id);
      }
    });
  }

  parseTimestamp(date: string) {
    const parsedDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: 'Europe/Kiev',
    };

    return parsedDate.toLocaleDateString('uk-UA', options);
  }

  openDialog(name, email, createdAt, dueDate, done, content) {
    let dialogRef = this.matDialog.open(HomeworkDetailsDialogComponent, {
      data: { name, email, createdAt, dueDate, done, content },
    });

    dialogRef.afterClosed().subscribe();
  }

  deleteTask(id) {
    this.homeworkService.deleteHomework(id).subscribe({
      next: () => {
        this.snackBar.open('Завдання видалено', '✅', {
          duration: 5000,
        });
        this.ngOnInit();
      },
      error: () => {
        this.snackBar.open('Щось пішло не так. Спробуйте ще раз', '❌', {
          duration: 5000,
        });
      },
    });
  }

  changeTaskStatus(id, done) {
    this.awaitingResponse = true;
    this.homeworkService.updateTaskStatus(id, done).subscribe({
      next: () => {
        this.awaitingResponse = false;
        this.snackBar.open('Статус оновлено', '✅', {
          duration: 5000,
        });
        this.ngOnInit();
      },
      error: () => {
        this.snackBar.open('Щось пішло не так. Спробуйте ще раз', '❌', {
          duration: 5000,
        });
        this.awaitingResponse = false;
      },
    });
  }
}
