import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { HomeworkService } from 'src/app/services/homework.service';
import { HomeworkDetailsDialogComponent } from './homework-details-dialog/homework-details-dialog.component';
import { NewTaskComponent } from './new-task/new-task.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  homework$: Observable<any>;
  filteredHomework$: Observable<any>;

  userId = '';
  isUserTeacher = false;
  awaitingResponse = false;

  taskSearchForm = this.fb.group({
    studentEmail: 'default',
  });

  icons = {
    add: faPlus,
  };

  areTasksLoaded = false;

  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private homeworkService: HomeworkService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.isUserTeacher = user.role === 'teacher';

      if (this.isUserTeacher) {
        this.homework$ = this.homeworkService.getAllHomework();

        this.taskSearchForm
          .get('studentEmail')
          .valueChanges.subscribe((value) => {
            this.filteredHomework$ = this.homework$.pipe(
              map((h) => {
                let [response] = h.filter((h) => h.email == value);
                return response.homework;
              })
            );
          });
      } else {
        this.homework$ = this.homeworkService.getHomeworkById(user.id);
        this.homework$.subscribe((data) => {
          if (data) this.areTasksLoaded = true;
        });
        this.userId = user.id;
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

  deleteTask(id) {
    this.homeworkService.deleteHomework(id).subscribe({
      next: () => {
        this.homework$ = this.homeworkService.getAllHomework();
        this.filteredHomework$ = this.homework$.pipe(
          map((h) => {
            let [response] = h.filter(
              (h) => h.email == this.studentEmail.value
            );
            return response.homework;
          })
        );
        this.snackBar.open('Завдання видалено', '👍', {
          duration: 5000,
        });
      },
      error: () => {
        this.snackBar.open('Щось пішло не так. Спробуйте ще раз', '👍', {
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
        if (this.isUserTeacher) {
          this.homework$ = this.homeworkService.getAllHomework();
          this.filteredHomework$ = this.homework$.pipe(
            map((h) => {
              let [response] = h.filter(
                (h) => h.email == this.studentEmail.value
              );
              return response.homework;
            })
          );
        } else {
          this.homework$ = this.homeworkService.getHomeworkById(this.userId);
        }

        this.snackBar.open('Статус оновлено', '👍', {
          duration: 5000,
        });
      },
      error: () => {
        this.snackBar.open('Щось пішло не так. Спробуйте ще раз', '👍', {
          duration: 5000,
        });
        this.awaitingResponse = false;
      },
    });
  }

  createTaskDialog() {
    this.matDialog
      .open(NewTaskComponent)
      .afterClosed()
      .subscribe(() => {
        this.homework$ = this.homeworkService.getAllHomework();
        this.filteredHomework$ = this.homework$.pipe(
          map((h) => {
            let [response] = h.filter(
              (h) => h.email == this.studentEmail.value
            );
            return response.homework;
          })
        );
      });
  }

  openDetailsDialog(content) {
    this.matDialog.open(HomeworkDetailsDialogComponent, {
      data: content,
    });
  }

  get studentEmail() {
    return this.taskSearchForm.get('studentEmail');
  }
}
