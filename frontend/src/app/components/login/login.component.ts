import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  // True when response status is 401 (invalid pwd or email)
  showErrorMsg = false;

  // Error msg after login attempt
  errorMsg = '';

  // Used by submit btn
  awaitingResponse = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    } else {
      this.awaitingResponse = true;
      this.authService.login(this.email.value, this.password.value).subscribe({
        next: (event) => {
          this.awaitingResponse = false;
        },
        error: (event) => {
          this.errorMsg = event.error.msg;
          this.awaitingResponse = false;
          this.showErrorMsg = true;
        },
      });
    }
  }
}
