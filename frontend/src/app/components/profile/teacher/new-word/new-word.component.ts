import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SchoolService } from 'src/app/services/school.service';

@Component({
  selector: 'app-new-word',
  templateUrl: './new-word.component.html',
  styleUrls: ['./new-word.component.css'],
})
export class NewWordComponent implements OnInit {
  students$: Observable<any[]>;

  newWordForm = this.fb.group({
    student: 'default',
    date: ['', Validators.required],
    word: ['', Validators.required],
    transcription: ['', Validators.required],
    translation: ['', Validators.required],
  });

  awaitingResponse = false;
  showErrorMsg = false;
  showSuccessMsg = false;

  ngOnInit(): void {
    this.students$ = this.ss.getAllStudents();
  }

  constructor(private fb: FormBuilder, private ss: SchoolService) {}

  get student() {
    return this.newWordForm.get('student');
  }

  get date() {
    return this.newWordForm.get('date');
  }

  get word() {
    return this.newWordForm.get('word');
  }

  get transcription() {
    return this.newWordForm.get('transcription');
  }

  get translation() {
    return this.newWordForm.get('translation');
  }

  onSubmit() {
    if (this.newWordForm.invalid || this.student.value === 'default') {
      this.newWordForm.markAllAsTouched();
    } else {
      this.awaitingResponse = true;
      this.ss
        .createWord(
          this.student.value,
          this.date.value,
          this.word.value,
          this.transcription.value,
          this.translation.value
        )
        .subscribe({
          next: (e) => {
            this.awaitingResponse = false;
            this.showSuccessMsg = true;
            this.newWordForm.reset();
          },
          error: (e) => {
            this.awaitingResponse = false;
            this.showErrorMsg = true;
          },
        });
    }
  }
}
