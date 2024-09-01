import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SchoolService } from 'src/app/services/school.service';

@Component({
  selector: 'app-new-class',
  templateUrl: './new-class.component.html',
  styleUrls: ['./new-class.component.css'],
})
export class NewClassComponent implements OnInit {
  students$: Observable<any[]>;

  newClassForm = this.fb.group({
    student: 'default',
    start: [this.getCurrentTimestamp(), Validators.required],
    end: [this.getCurrentTimestamp(), Validators.required],
  });

  awaitingResponse = false;
  showErrorMsg = false;
  showSuccessMsg = false;

  ngOnInit(): void {
    this.students$ = this.ss.getAllStudents();
  }

  constructor(private fb: FormBuilder, private ss: SchoolService) {}

  get student() {
    return this.newClassForm.get('student');
  }

  get start() {
    return this.newClassForm.get('start');
  }

  get end() {
    return this.newClassForm.get('end');
  }

  onSubmit() {
    if (this.newClassForm.invalid || this.student.value === 'default') {
      this.newClassForm.markAllAsTouched();
    } else {
      this.awaitingResponse = true;
      const id = this.student.value.split(' ')[0];
      const name = this.student.value.split(' ')[1];

      this.ss
        .createClass(id, name, this.start.value, this.end.value)
        .subscribe({
          next: (e) => {
            this.awaitingResponse = false;
            this.showSuccessMsg = true;
            this.newClassForm.reset();
          },
          error: (e) => {
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
