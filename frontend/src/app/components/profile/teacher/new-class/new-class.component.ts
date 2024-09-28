import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ClassesService } from 'src/app/services/classes.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-new-class',
  templateUrl: './new-class.component.html',
  styleUrls: ['./new-class.component.css'],
})
export class NewClassComponent implements OnInit {
  students$: Observable<any[]>;

  newClassForm = this.fb.group({
    studentId: 'default',
    start: ['', Validators.required],
    end: ['', Validators.required],
    price: [300, [Validators.required, Validators.min(0)]],
  });

  awaitingResponse = false;

  ngOnInit(): void {
    this.students$ = this.studentService.getAllValidStudents();
  }

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private studentService: StudentService,
    private classService: ClassesService
  ) {}

  get studentId() {
    return this.newClassForm.get('studentId');
  }

  get start() {
    return this.newClassForm.get('start');
  }

  get end() {
    return this.newClassForm.get('end');
  }

  get price() {
    return this.newClassForm.get('price');
  }

  onSubmit() {
    if (this.newClassForm.invalid || this.studentId.value === 'default') {
      this.newClassForm.markAllAsTouched();
    } else {
      this.awaitingResponse = true;

      this.classService
        .createClass(
          this.studentId.value,
          this.start.value,
          this.end.value,
          this.price.value
        )
        .subscribe({
          next: () => {
            this.awaitingResponse = false;
            this.newClassForm.reset();
            this.snackBar.open('Урок створено', '👍', {
              duration: 5000,
            });
          },
          error: () => {
            this.awaitingResponse = false;
            this.snackBar.open('Щось пішло не так. Спробуйте ще раз', '👍', {
              duration: 5000,
            });
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
