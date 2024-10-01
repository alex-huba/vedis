import { HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CountryISO } from 'ngx-intl-tel-input';
import { timezones } from 'src/app/models/timezones';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^.*(?:(?!\s|')[a-zA-Zа-яА-ЯїЇіІєЄґҐ']).*/),
      ],
    ],
    phoneNumber: [undefined, Validators.required],
    email: [
      '',
      [Validators.required, Validators.email, Validators.minLength(5)],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d|.*[!@#_$%^&*])/),
      ],
    ],
    timezone: ['', Validators.required],
  });

  // Used by phone field
  preferredCountries: CountryISO[] = [
    CountryISO.Ukraine,
    CountryISO.Germany,
    CountryISO.Austria,
    CountryISO.Switzerland,
    CountryISO.UnitedKingdom,
    CountryISO.UnitedStates,
    CountryISO.Poland,
    CountryISO.CzechRepublic,
    CountryISO.Slovenia,
    CountryISO.Slovakia,
    CountryISO.Romania,
  ];

  // Used by submit btn
  awaitingResponse = false;

  // True when response status is 400
  showErrorMsg = false;
  errorMsg = '';

  // List of major timezones
  timezones = timezones;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  get name() {
    return this.signupForm.get('name');
  }

  get phoneNumber() {
    return this.signupForm.get('phoneNumber');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get timezone() {
    return this.signupForm.get('timezone');
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
    } else {
      this.authService
        .signup(
          this.name.value,
          this.email.value,
          this.password.value,
          this.phoneNumber.value,
          this.timezone.value
        )
        .subscribe({
          next: (event) => {
            switch (event.type) {
              case HttpEventType.Sent:
                this.awaitingResponse = true;
                break;
              case HttpEventType.Response:
                this.snackBar.open('Профіль створено', '👍', {
                  duration: 5000,
                });
                this.router.navigate(['/login']);
                break;
            }
          },
          error: (event) => {
            this.awaitingResponse = false;
            this.errorMsg = event.error.message;
            this.showErrorMsg = true;
          },
        });
    }
  }
}
