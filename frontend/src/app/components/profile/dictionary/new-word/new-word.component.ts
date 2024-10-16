import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-new-word',
  templateUrl: './new-word.component.html',
  styleUrls: ['./new-word.component.css'],
})
export class NewWordComponent implements OnInit {
  students$: Observable<any[]>;

  newWordForm = this.fb.group({
    studentId: 'default',
    dueDate: ['', Validators.required],
    word: ['', Validators.required],
    transcription: ['', Validators.required],
    translation: ['', Validators.required],
  });

  awaitingResponse = false;

  ngOnInit() {
    this.students$ = this.studentService.getAllValidStudents();
  }

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private snackBar: MatSnackBar,
    private dictionaryService: DictionaryService,
    private dialogRef: MatDialogRef<NewWordComponent>
  ) {}

  onSubmit() {
    if (this.newWordForm.invalid || this.studentId.value === 'default') {
      this.newWordForm.markAllAsTouched();
    } else {
      this.awaitingResponse = true;
      this.dictionaryService
        .createWord(
          this.studentId.value,
          this.dueDate.value,
          this.word.value,
          this.transcription.value,
          this.translation.value
        )
        .subscribe({
          next: () => {
            this.awaitingResponse = false;
            this.newWordForm.reset();
            this.dialogRef.close();
            this.snackBar.open('Слово додано до словника', '👍', {
              duration: 5000,
            });
          },
          error: () => {
            this.awaitingResponse = false;
            this.snackBar.open('Щось пішло не так. Спробуйте ще раз', '👍', {
              duration: 5000,
            });
          },
        });
    }
  }

  get studentId() {
    return this.newWordForm.get('studentId');
  }
  get dueDate() {
    return this.newWordForm.get('dueDate');
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
}
