import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SchoolService } from 'src/app/services/school.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css'],
})
export class DictionaryComponent implements OnInit {
  words$: Observable<any[]>;
  filteredWords$: Observable<any[]>;

  isUserTeacher = false;

  studentForm = this.fb.group({
    studentSelection: 'default',
  });

  wordSearchForm = this.fb.group({
    wordRegex: '',
  });

  constructor(
    private ss: SchoolService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.isUserTeacher = user.role === 'teacher';

      if (this.isUserTeacher) {
        this.words$ = this.ss.getWholeDictionary();
      } else {
        this.words$ = this.ss.getDictionaryById(user.id);
      }
    });

    this.studentForm.valueChanges.subscribe((value) => {
      this.filteredWords$ = this.words$.pipe(
        map((students) =>
          students.filter((s) => s.id === value.studentSelection)
        )
      );
    });

    this.wordSearchForm
      .get('wordRegex')
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm: string) => {
        if(searchTerm === "") {
          this.filteredWords$ = this.words$.pipe(
            map((students) =>
              students.filter((s) => s.id === this.studentSelection.value)
            )
          );
        } else {
          this.filteredWords$ = this.filteredWords$.pipe(
            map((students) =>
              students.map((student) => ({
                ...student,
                dictionary: student.dictionary.filter((entry) =>
                  entry.word.toLowerCase().includes(searchTerm.toLowerCase())
                ),
              }))
            )
          );
        }
      });
  }

  parseTimestamp(date: string) {
    const parsedDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Europe/Kiev',
    };

    return parsedDate.toLocaleDateString('uk-UA', options);
  }

  deleteWord(id) {
    this.ss.deleteWord(id).subscribe({
      next: (res) => {
        this.ngOnInit();
        this.snackBar.open('Слово видалено', '✅', {
          duration: 5000,
        });
      },
      error: (err) => {
        this.snackBar.open('Щось пішло не так. Спробуйте ще раз', '❌', {
          duration: 5000,
        });
      },
    });
  }

  hideTranslation(index) {
    let td = document.querySelector(`#translation-${index}`);
    td.classList.toggle('hidden-text');
  }

  get studentSelection() {
    return this.studentForm.get('studentSelection');
  }
}
