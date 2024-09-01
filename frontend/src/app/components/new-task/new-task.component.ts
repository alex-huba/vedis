import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EditorConfig, ST_BUTTONS } from 'ngx-simple-text-editor';
import { Observable } from 'rxjs';
import { SchoolService } from 'src/app/services/school.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css'],
})
export class NewTaskComponent implements OnInit {
  students$: Observable<any[]>;

  newTaskForm = this.fb.group({
    student: 'default',
    date: [this.getCurrentTimestamp(), Validators.required],
  });

  content = '';

  config: EditorConfig = {
    placeholder: 'Напишіть ваше завдання...',
    buttons: ST_BUTTONS,
  };

  awaitingResponse = false;
  showErrorMsg = false;
  showSuccessMsg = false;

  ngOnInit(): void {
    this.students$ = this.ss.getAllStudents();
  }

  constructor(private fb: FormBuilder, private ss: SchoolService) {}

  get student() {
    return this.newTaskForm.get('student');
  }

  get date() {
    return this.newTaskForm.get('date');
  }

  onSubmit() {
    if (this.newTaskForm.invalid || this.content === '') {
      this.newTaskForm.markAllAsTouched();
    } else {
      this.awaitingResponse = true;
      const studentId = this.student.value.split(' ')[0];
      const studentName = this.student.value.split(' ')[1];

      this.ss
        .createHomework(
          studentId,
          this.date.value,
          'not done',
          this.content,
          studentName
        )
        .subscribe({
          next: (res) => {
            this.awaitingResponse = false;
            this.showSuccessMsg = true;
            this.newTaskForm.reset();
            this.content = "";
          },
          error: (err) => {
            this.awaitingResponse = false;
            this.showErrorMsg = true;
          },
        });
    }
  }

  getCurrentTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const date = ('0' + now.getDate()).slice(-2);
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);

    return `${year}-${month}-${date}T${hours}:${minutes}`;
  }
}
