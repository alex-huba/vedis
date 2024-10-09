import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CountryISO } from 'ngx-intl-tel-input';
import { ContactInfo } from 'src/app/models/contact-info';
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
        Validators.pattern(/^[a-zA-Zа-яА-ЯїЇіІєЄґҐ']+$/),
      ],
    ],
    email: [
      '',
      [Validators.required, Validators.email, Validators.minLength(5)],
    ],
    language: ['default', Validators.required],
    phone: [undefined, Validators.required],
    contactOption: 'default',
  });

  isSubmitted = false;
  baseUrl: string;

  constructor(private fb: FormBuilder, private cs: ContactService) {}

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
    } else {
      this.cs.sendData(this.contactForm.value as ContactInfo).subscribe();
    }
  }

  get name() {
    return this.contactForm.get('name');
  }
  get email() {
    return this.contactForm.get('email');
  }
  get language() {
    return this.contactForm.get('language');
  }
  get phone() {
    return this.contactForm.get('phone');
  }
  get contactOption() {
    return this.contactForm.get('contactOption');
  }
}
