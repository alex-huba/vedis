import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  userId = '';
  token = '';

  awaitingResponse = false;

  resetPwdForm = this.fb.group(
    {
      pwd1: ['', Validators.required],
      pwd2: ['', Validators.required],
    },
    { validator: this.passwordMatchValidator() }
  );

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.token = this.route.snapshot.paramMap.get('token');
  }

  onSubmit() {
    if (this.resetPwdForm.invalid) {
      this.resetPwdForm.markAllAsTouched();
    } else {
      this.awaitingResponse = true;
      this.authService
        .resetPassword(this.userId, this.token, this.pwd1.value)
        .subscribe({
          next: () => {
            this.awaitingResponse = false;
            this.snackBar.open('Пароль змінено', '👍', { duration: 5000 });
            this.router.navigate(['/login']);
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

  get pwd1() {
    return this.resetPwdForm.get('pwd1');
  }
  get pwd2() {
    return this.resetPwdForm.get('pwd2');
  }

  passwordMatchValidator() {
    return (formGroup: AbstractControl) => {
      const pwd1 = formGroup.get('pwd1')?.value;
      const pwd2 = formGroup.get('pwd2')?.value;

      return pwd1 && pwd2 && pwd1 !== pwd2 ? { passwordMismatch: true } : null;
    };
  }
}
