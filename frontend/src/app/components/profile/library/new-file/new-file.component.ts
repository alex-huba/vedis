import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { LibraryService } from 'src/app/services/library.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-new-file',
  templateUrl: './new-file.component.html',
  styleUrls: ['./new-file.component.css'],
})
export class NewFileComponent implements OnInit {
  students$: Observable<any>;

  newFileForm = this.fb.group({
    studentId: ['', Validators.required],
  });

  selectedFile: File;

  icons = {
    upload: faArrowUpFromBracket,
  };

  constructor(
    private fb: FormBuilder,
    private studentsService: StudentService,
    private libraryService: LibraryService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<NewFileComponent>
  ) {}

  ngOnInit() {
    this.students$ = this.studentsService.getAllValidStudents();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.newFileForm.invalid) {
      this.newFileForm.markAllAsTouched();
    } else {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.libraryService.uploadFile(formData, this.studentId.value).subscribe({
        next: () => {
          this.dialogRef.close();
          this.snackBar.open('Файл завантажено', '👍', {
            duration: 15000,
          });
        },
        error: () => {
          this.snackBar.open('Помилка. Спробуйте ще раз', '👍', {
            duration: 5000,
          });
        },
      });
    }
  }

  get studentId() {
    return this.newFileForm.get('studentId');
  }
}
