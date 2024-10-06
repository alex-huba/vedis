import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css'],
})
export class RecoverComponent {
  recoverForm = this.fb.group({
    email: ['', Validators.email],
  });

  // Used by submit btn
  awaitingResponse = false;

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.recoverForm.invalid) {
      this.recoverForm.markAllAsTouched();
    } else {
      this.awaitingResponse = true;
    }
  }

  get email() {
    return this.recoverForm.get('email');
  }
}
