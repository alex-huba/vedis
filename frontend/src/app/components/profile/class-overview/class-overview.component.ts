import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ClassesService } from 'src/app/services/classes.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-class-overview',
  templateUrl: './class-overview.component.html',
  styleUrls: ['./class-overview.component.css'],
})
export class ClassOverviewComponent implements OnInit {
  isUserTeacher = false;

  classes$: Observable<any>;
  filteredClasses$: Observable<any>;
  students$: Observable<any>;

  classSearchForm = this.fb.group({
    studentId: 'default',
  });

  currentPage: number = 1;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private classService: ClassesService,
    private studentService: StudentService,
    private classesService: ClassesService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.isUserTeacher = user.role === 'teacher';

      if (this.isUserTeacher) {
        this.classes$ = this.classes$ = this.classService.getAllClasses().pipe(
          map((classes) => {
            return classes.map((c) => ({
              ...c,
              start: new Date(c.start).toISOString().slice(0, 10),
            }));
          })
        );

        this.students$ = this.studentService.getAllValidStudents();
      } else {
        this.classes$ = this.classService.getClassesById(user.id).pipe(
          map((classes) => {
            return classes.map((c) => ({
              ...c,
              start: new Date(c.start).toISOString().slice(0, 10),
            }));
          })
        );
        this.filteredClasses$ = this.classes$;
      }
    });

    this.classSearchForm
      .get('studentId')
      .valueChanges.subscribe((studentId) => {
        this.filteredClasses$ = this.classes$.pipe(
          map((arr) => {
            let classes = arr.filter((c) => c.studentId == studentId);
            return classes;
          })
        );
      });
  }

  changePaymentStatus(id, isPaid) {
    const successMessage = 'Статус оплати змінено';

    this.classesService.updatePaymentStatus(id, !isPaid).subscribe({
      next: () => {
        this.classSearchForm.patchValue({
          studentId: this.studentId.value,
        });
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

  deleteClass(id) {
    this.classesService.deleteClass(id).subscribe({
      next: () => {
        this.classSearchForm.patchValue({
          studentId: this.studentId.value,
        });
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

  cancelClass(id, isCancelled) {
    const successMessage = !isCancelled
      ? 'Заняття відмінено'
      : 'Заняття відновлено';

    this.classesService.updateStatus(id, !isCancelled).subscribe({
      next: () => {
        if (this.isUserTeacher) {
          this.classSearchForm.patchValue({
            studentId: this.studentId.value,
          });
        } else {
          this.ngOnInit();
        }
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

  /**
   * @returns true when there are more than 12 hours before cancellation
   */
  cancellationPolicy(start) {
    const timestampDate = new Date(start);
    const currentDate = new Date();
    const timeDifference = timestampDate.getTime() - currentDate.getTime();

    // Check if the time difference is more than 12 hours (in milliseconds)
    return timeDifference > 12 * 60 * 60 * 1000;
  }

  get studentId() {
    return this.classSearchForm.get('studentId');
  }
}
