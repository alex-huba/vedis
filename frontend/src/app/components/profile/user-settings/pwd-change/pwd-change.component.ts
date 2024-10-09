import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-pwd-change',
  templateUrl: './pwd-change.component.html',
  styleUrls: ['./pwd-change.component.css'],
})
export class PwdChangeComponent {
  awaitingResponse = false;

  resetPwdForm = this.fb.group(
    {
      pwd1: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d|.*[!@#_$%^&*])/),
        ],
      ],
      pwd2: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d|.*[!@#_$%^&*])/),
        ],
      ],
    },
    { validator: this.passwordMatchValidator() }
  );

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private dialogRef: DialogRef<PwdChangeComponent>,
    @Inject(MAT_DIALOG_DATA)
    public inputData: {
      userId: string;
    }
  ) {}

  onSubmit() {
    if (this.resetPwdForm.invalid) {
      this.resetPwdForm.markAllAsTouched();
    } else {
      this.awaitingResponse = true;
      this.authService
        .changePassword(this.inputData, this.pwd1.value)
        .subscribe({
          next: () => {
            this.awaitingResponse = false;
            this.snackBar.open('Пароль змінено', '👍', { duration: 5000 });
            this.dialogRef.close();
          },
          error: () => {
            this.awaitingResponse = false;
            this.snackBar.open('Помилка', '👍', {
              duration: 5000,
            });
          },
        });
    }
  }

  passwordMatchValidator() {
    return (formGroup: AbstractControl) => {
      const pwd1 = formGroup.get('pwd1')?.value;
      const pwd2 = formGroup.get('pwd2')?.value;

      return pwd1 && pwd2 && pwd1 !== pwd2 ? { passwordMismatch: true } : null;
    };
  }

  get pwd1() {
    return this.resetPwdForm.get('pwd1');
  }
  get pwd2() {
    return this.resetPwdForm.get('pwd2');
  }
}
