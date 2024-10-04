import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditorConfig, ST_BUTTONS } from 'ngx-simple-text-editor';
import { Observable } from 'rxjs';
import { HomeworkService } from 'src/app/services/homework.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css'],
})
export class NewTaskComponent implements OnInit {
  students$: Observable<any[]>;

  newTaskForm = this.fb.group({
    studentId: 'default',
    dueDate: [null, Validators.required],
  });

  content = '';

  excludedCommands = [
    'insertImage',
    'strikeThrough',
    'justifyRight',
    'justifyFull',
    'subscript',
    'superscript',
  ];
  buttons = ST_BUTTONS.filter(
    //@ts-ignore
    (b) => !this.excludedCommands.includes(b.command)
  );

  config: EditorConfig = {
    placeholder: 'Напишіть ваше завдання...',
    buttons: this.buttons,
  };

  awaitingResponse = false;

  ngOnInit(): void {
    this.students$ = this.studentService.getAllValidStudents();
  }

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private homeworkService: HomeworkService,
    private snackBar: MatSnackBar,
    private dialogRef: DialogRef<NewTaskComponent>
  ) {}

  onSubmit() {
    if (this.newTaskForm.invalid || this.content === '') {
      this.newTaskForm.markAllAsTouched();
    } else {
      this.awaitingResponse = true;

      this.homeworkService
        .createHomework(this.studentId.value, this.dueDate.value, this.content)
        .subscribe({
          next: () => {
            this.awaitingResponse = false;
            this.newTaskForm.reset();
            this.content = '';
            this.dialogRef.close();
            this.snackBar.open('ДЗ збережено', '👍', {
              duration: 5000,
            });
          },
          error: () => {
            this.awaitingResponse = false;
            this.snackBar.open('Помилка. Спробуйте ще раз', '👍', {
              duration: 5000,
            });
          },
        });
    }
  }

  get studentId() {
    return this.newTaskForm.get('studentId');
  }
  get dueDate() {
    return this.newTaskForm.get('dueDate');
  }
}
