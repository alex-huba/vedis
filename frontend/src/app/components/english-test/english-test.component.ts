import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-english-test',
  templateUrl: './english-test.component.html',
  styleUrls: ['./english-test.component.css'],
})
export class EnglishTestComponent {
  questions = this.fb.group({
    q1: ['', Validators.required],
    q2: ['', Validators.required],
    q3: ['', Validators.required],
    q4: ['', Validators.required],
    q5: ['', Validators.required],
    q6: ['', Validators.required],
    q7: ['', Validators.required],
    q8: ['', Validators.required],
    q9: ['', Validators.required],
    q10: ['', Validators.required],
    q11: ['', Validators.required],
    q12: ['', Validators.required],
    q13: ['', Validators.required],
    q14: ['', Validators.required],
    q15: ['', Validators.required],
    q16: ['', Validators.required],
    q17: ['', Validators.required],
    q18: ['', Validators.required],
    q19: ['', Validators.required],
    q20: ['', Validators.required],
    q21: ['', Validators.required],
    q22: ['', Validators.required],
    q23: ['', Validators.required],
    q24: ['', Validators.required],
    q25: ['', Validators.required],
    q26: ['', Validators.required],
    q27: ['', Validators.required],
    q28: ['', Validators.required],
    q29: ['', Validators.required],
    q30: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {}
}
