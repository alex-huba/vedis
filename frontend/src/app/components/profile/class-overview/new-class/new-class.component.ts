import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, map, Observable, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ClassesService } from 'src/app/services/classes.service';
import { StudentService } from 'src/app/services/student.service';
import { DateTime } from 'luxon';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-new-class',
  templateUrl: './new-class.component.html',
  styleUrls: ['./new-class.component.css'],
})
export class NewClassComponent implements OnInit {
  // Array of all verified students
  students$: Observable<any>;

  // Timezones in format "Europe/Berlin"
  public timezone = {
    teacher: '',
    student: '',
  };

  // Converted start and end timestamps for teacher
  public teacherTime = {
    start: '',
    end: '',
  };

  newClassForm = this.fb.group({
    studentId: 'default',
    start: ['', Validators.required],
    end: ['', Validators.required],
    price: [300, [Validators.required, Validators.min(0)]],
  });

  awaitingResponse = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private studentService: StudentService,
    private classService: ClassesService,
    private authService: AuthService,
    private dialogRef: DialogRef<NewClassComponent>
  ) {}

  ngOnInit() {
    // Get all verified students
    this.students$ = this.studentService.getAllValidStudents();

    // Get teacher's timezone
    this.authService.currentUser$.subscribe(
      (u) => (this.timezone.teacher = u.timezone)
    );

    // Get student's timezone
    this.newClassForm
      .get('studentId')
      .valueChanges.pipe(
        filter((studentId) => studentId !== '' && studentId !== null),
        switchMap((studentId) =>
          this.students$.pipe(
            map((students) => students.find((s) => s.id === studentId)),
            map((student) => student.timezone)
          )
        )
      )
      .subscribe((timezone) => {
        this.timezone.student = timezone;
        this.teacherTime.start = this.convertTimeToTeachersTimezone(
          this.newClassForm.get('start').value
        );
        this.teacherTime.end = this.convertTimeToTeachersTimezone(
          this.newClassForm.get('end').value
        );
      });

    // Get start of class for teacher's timezone
    this.newClassForm.get('start').valueChanges.subscribe((timeStamp) => {
      this.teacherTime.start = this.convertTimeToTeachersTimezone(timeStamp);
    });

    // Get end of class for teacher's timezone
    this.newClassForm.get('end').valueChanges.subscribe((timeStamp) => {
      this.teacherTime.end = this.convertTimeToTeachersTimezone(timeStamp);
    });
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
            this.timezone.student = '';
            this.teacherTime.start = '';
            this.teacherTime.end = '';
            this.dialogRef.close();
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

  /**
   *
   * @param studentTimestamp string
   * @returns converted timestamp for teacher's timezone in format "HH:mm"
   */
  convertTimeToTeachersTimezone(studentTimestamp) {
    // Parse the student's timestamp using their timezone
    const studentTime = DateTime.fromISO(studentTimestamp, {
      zone: this.timezone.student,
    });

    // Convert the student's time to the teacher's timezone
    const teacherTime = studentTime.setZone(this.timezone.teacher);

    // Return the teacher's time in a readable format
    return teacherTime.toFormat('HH:mm');
  }

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
}
