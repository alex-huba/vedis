import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CountryISO } from 'ngx-intl-tel-input';
import { preferredCountries } from 'src/app/models/preferredCountriesPhone';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css'],
})
export class ClientFormComponent {
  preferredCountries: CountryISO[] = preferredCountries;

  contactForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Zа-яА-ЯїЇіІєЄґҐ' ]+$/),
      ],
    ],
    email: [
      '',
      [Validators.required, Validators.email, Validators.minLength(5)],
    ],
    course: ['default', Validators.required],
    phoneNumber: [undefined, Validators.required],
    howToConnect: 'default',
  });

  isSubmitted = false;
  baseUrl: string;

  constructor(
    private fb: FormBuilder,
    private cs: ContactService,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
    } else {
      this.cs.sendData(this.contactForm.value).subscribe({
        next: () => {
          this.contactForm.reset();
          this.contactForm.patchValue({
            course: 'default',
            howToConnect: 'default',
            phoneNumber: undefined,
          });
          this.snackBar.open('Дякуємо за заявку', '👍', { duration: 5000 });
        },
        error: (err) => {
          this.snackBar.open(`${err.message}`, '👍', { duration: 5000 });
        },
      });
    }
  }

  get name() {
    return this.contactForm.get('name');
  }
  get email() {
    return this.contactForm.get('email');
  }
  get course() {
    return this.contactForm.get('course');
  }
  get phoneNumber() {
    return this.contactForm.get('phoneNumber');
  }
  get howToConnect() {
    return this.contactForm.get('howToConnect');
  }
}
