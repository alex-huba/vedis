import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { ClassesService } from 'src/app/services/classes.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-class-details-dialog',
  templateUrl: './class-details-dialog.component.html',
  styleUrls: ['./class-details-dialog.component.css'],
})
export class ClassDetailsDialogComponent implements OnInit {
  isUserTeacher = false;

  teacherTime = {
    start: '',
    end: '',
  };

  classForm = this.fb.group({
    studentName: [this.data.studentName, Validators.required],
    start: [this.data.start, Validators.required],
    end: [this.data.end, Validators.required],
    isCancelled: [this.data.isCancelled, Validators.required],
    price: [this.data.price, Validators.required],
    isPaid: [this.data.isPaid, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private classesService: ClassesService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ClassDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: string;
      isCancelled: boolean;
      studentId: string;
      studentName: string;
      start: any;
      end: any;
      price: number;
      isPaid: boolean;
      studentTimezone: string;
    }
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.isUserTeacher = user.role === 'teacher';
      if (this.isUserTeacher) {
        this.teacherTime.start = DateTime.fromISO(this.data.start).toFormat(
          'HH:mm'
        );
        this.teacherTime.end = DateTime.fromISO(this.data.end).toFormat(
          'HH:mm'
        );

        this.start.setValue(
          this.convertTimeToStudentTimezone(this.data.start, user.timezone),
          'start'
        );
        this.end.setValue(
          this.convertTimeToStudentTimezone(this.data.end, user.timezone),
          'end'
        );
      } else {
        this.start.setValue(this.data.start, 'start');
        this.end.setValue(this.data.end, 'end');
      }

      this.classForm.disable();
    });
  }

  cancelClass() {
    const newStatus = !this.isCancelled.value;
    const successMessage = newStatus
      ? 'Заняття відмінено'
      : 'Заняття відновлено';

    this.classesService.updateStatus(this.data.id, newStatus).subscribe({
      next: () => {
        this.isCancelled.setValue(newStatus);
        this.snackBar.open(successMessage, '👍', {
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

  changePaymentStatus() {
    const newStatus = !this.isPaid.value;
    const successMessage = 'Статус оплати змінено';

    this.classesService.updatePaymentStatus(this.data.id, newStatus).subscribe({
      next: () => {
        this.isPaid.setValue(newStatus);
        this.snackBar.open(successMessage, '👍', {
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

  deleteClass() {
    this.classesService.deleteClass(this.data.id).subscribe({
      next: () => {
        this.dialogRef.close();
        this.snackBar.open('Заняття видалено', '👍', {
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

  /**
   * @returns true when there are more than 12 hours before cancellation
   */
  cancellationPolicy() {
    const timestampDate = new Date(this.start.value);
    const currentDate = new Date();
    const timeDifference = timestampDate.getTime() - currentDate.getTime();

    // Check if the time difference is more than 12 hours (in milliseconds)
    return timeDifference > 12 * 60 * 60 * 1000;
  }

  /**
   *
   * @param studentTimestamp string
   * @param teacherTimezone string
   * @returns converted timestamp for student's timezone in format "yyyy-MM-dd'T'HH:mm"
   */
  convertTimeToStudentTimezone(teacherTimestamp, teacherTimezone) {
    // Parse the teacher's timestamp using their timezone
    const teacherTime = DateTime.fromISO(teacherTimestamp, {
      zone: teacherTimezone,
    });

    // Convert the teacher's time to the student's timezone
    const studentTime = teacherTime.setZone(this.data.studentTimezone);

    // Return the student's time in a readable format
    return studentTime.toFormat("yyyy-MM-dd'T'HH:mm");
  }

  onSubmit() {}
  get start() {
    return this.classForm.get('start');
  }
  get end() {
    return this.classForm.get('end');
  }
  get studentName() {
    return this.classForm.get('studentName');
  }
  get isCancelled() {
    return this.classForm.get('isCancelled');
  }
  get price() {
    return this.classForm.get('price');
  }
  get isPaid() {
    return this.classForm.get('isPaid');
  }
}
