import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SchoolService } from 'src/app/services/school.service';

@Component({
  selector: 'app-class-details-dialog',
  templateUrl: './class-details-dialog.component.html',
  styleUrls: ['./class-details-dialog.component.css'],
})
export class ClassDetailsDialogComponent implements OnInit {
  editStarted = false;
  editIcon = faPenToSquare;
  isUserTeacher = false;
  students$: Observable<any[]>;
  haveDetailsChanged = false;

  classForm = this.fb.group({
    studentId: [this.data.studentId, Validators.required],
    classStart: [this.data.classStart, Validators.required],
    classEnd: [this.data.classEnd, Validators.required],
    classStatus: [this.data.classStatus, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private ss: SchoolService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ClassDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      classId: string;
      studentName: string;
      classStatus: string;
      studentId: string;
      classStart: string;
      classEnd: string;
    }
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.isUserTeacher = user.role === 'teacher';
      this.students$ = this.ss.getAllStudents();

      this.studentId.disable();
      this.classStart.disable();
      this.classEnd.disable();
    });

    this.classStart.setValue(this.convertDateToStr(this.data.classStart));
    this.classEnd.setValue(this.convertDateToStr(this.data.classEnd));
  }

  get classStart() {
    return this.classForm.get('classStart');
  }

  get classEnd() {
    return this.classForm.get('classEnd');
  }

  get studentId() {
    return this.classForm.get('studentId');
  }

  get classStatus() {
    return this.classForm.get('classStatus');
  }

  changeEditState() {
    this.editStarted = !this.editStarted;

    if (this.editStarted && this.isUserTeacher) {
      this.studentId.enable();
      this.classStart.enable();
      this.classEnd.enable();
    } else {
      this.studentId.disable();
      this.classStart.disable();
      this.classEnd.disable();
    }
  }

  cancelClass() {
    if (this.classStatus.value === 'OK') {
      this.classStatus.setValue('canceled');
    } else {
      this.classStatus.setValue('OK');
    }
    this.haveDetailsChanged = true;
  }

  deleteClass() {
    this.ss.deleteClass(this.data.classId).subscribe({
      next: (res) => {
        this.dialogRef.close();
        this.snackBar.open('Заняття видалено', '✅', {
          duration: 5000,
        });
      },
      error: (err) => {
        this.snackBar.open('Щось пішло не так. Спробуйте ще раз', '❌', {
          duration: 5000,
        });
      }
    });
  }

  onSubmit() {
    this.ss
      .updateClass(
        this.data.classId,
        this.classStatus.value,
        this.studentId.value,
        this.classStart.value,
        this.classEnd.value
      )
      .subscribe({
        next: (res) => {
          this.dialogRef.close();
          this.snackBar.open('Зміни збережено', '✅', {
            duration: 5000,
          });
        },
        error: (err) => {
          this.snackBar.open('Щось пішло не так. Спробуйте ще раз', '❌', {
            duration: 5000,
          });
        },
      });
  }

  // returns true when more than 24 hours
  cancellationPolicy() {
    const timestampDate = new Date(this.classStart.value);
    const currentDate = new Date();
    const timeDifference = timestampDate.getTime() - currentDate.getTime();

    // Check if the time difference is more than 12 hours (in milliseconds)
    return timeDifference > 12 * 60 * 60 * 1000;
  }

  convertDateToStr(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${mins}`;
  }
}
