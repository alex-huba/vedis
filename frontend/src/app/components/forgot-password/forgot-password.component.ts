import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  recoverForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  // Used by submit btn
  awaitingResponse = false;

  isEmailSent = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    if (this.recoverForm.invalid) {
      this.recoverForm.markAllAsTouched();
    } else {
      this.awaitingResponse = true;
      this.authService.forgotPassword(this.email.value).subscribe({
        next: () => {
          this.awaitingResponse = false;
          this.isEmailSent = true;
        },
        error: () => {
          this.awaitingResponse = false;
          this.snackBar.open('Профіль не знайдено', '👍', {
            duration: 5000,
          });
        },
      });
    }
  }

  get email() {
    return this.recoverForm.get('email');
  }
}
