import { HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CountryISO } from 'ngx-intl-tel-input';
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
    phone: [undefined, Validators.required],
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

  // True when response status is 422 (email exists in DB already)
  showErrorMsg = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  get name() {
    return this.signupForm.get('name');
  }

  get phone() {
    return this.signupForm.get('phone');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
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
          this.phone.value
        )
        .subscribe({
          next: (event) => {
            switch (event.type) {
              case HttpEventType.Sent:
                this.awaitingResponse = true;
                break;
              case HttpEventType.Response:
                this.router.navigate(['/login']);
                break;
            }
          },
          error: (event) => {
            this.awaitingResponse = false;
            if (event.status === 422) {
              this.showErrorMsg = true;
            }
          },
        });
    }
  }
}
