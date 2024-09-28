import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DictionaryService } from 'src/app/services/dictionary.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css'],
})
export class DictionaryComponent implements OnInit {
  dictionary$: Observable<any>;
  filteredDictionary$: Observable<any>;

  isUserTeacher = false;

  wordSearchForm = this.fb.group({
    studentId: 'default',
    wordRegex: '',
  });

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private fb: FormBuilder,
    private dictionaryService: DictionaryService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.isUserTeacher = user.role === 'teacher';

      if (this.isUserTeacher) {
        this.dictionary$ = this.dictionaryService.getWholeDictionary();
      } else {
        this.dictionary$ = this.dictionaryService.getDictionaryById(user.id);
        this.filteredDictionary$ = this.dictionary$;
      }
    });

    this.wordSearchForm.get('studentId').valueChanges.subscribe((value) => {
      this.filteredDictionary$ = this.dictionary$.pipe(
        map((d) => {
          let [dictionary] = d.filter((d) => d.studentId === value);
          return dictionary.words;
        })
      );
    });

    this.wordSearchForm
      .get('wordRegex')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((searchTerm) => {
        const regex = new RegExp(searchTerm, 'i');

        const filterDictionary = (dictionary, isTeacher) => {
          if (!searchTerm) return isTeacher ? dictionary.words : dictionary;
          return isTeacher
            ? dictionary.words.filter((w) => regex.test(w.word))
            : dictionary.filter((w) => regex.test(w.word));
        };

        const processDictionaries = (dictionaries) => {
          if (this.isUserTeacher) {
            const [dictionary] = dictionaries.filter(
              (d) => d.studentId == this.studentId.value
            );
            return filterDictionary(dictionary, true);
          }
          return filterDictionary(dictionaries, false);
        };

        this.filteredDictionary$ = this.dictionary$.pipe(
          map(processDictionaries)
        );
      });
  }

  parseTimestamp(date: string) {
    const parsedDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timeZone: 'Europe/Kiev',
    };

    return parsedDate.toLocaleDateString('uk-UA', options);
  }

  deleteWord(id) {
    this.dictionaryService.deleteWord(id).subscribe({
      next: () => {
        this.dictionary$ = this.dictionaryService.getWholeDictionary();
        this.filteredDictionary$ = this.dictionary$.pipe(
          map((d) => {
            let [dictionary] = d.filter((d) => d.studentId === this.studentId);
            return dictionary.words;
          })
        );
        this.snackBar.open('Слово видалено', '✅', {
          duration: 5000,
        });
      },
      error: () => {
        this.snackBar.open('Щось пішло не так. Спробуйте ще раз', '❌', {
          duration: 5000,
        });
      },
    });
  }

  hideTranslation(index) {
    let td = document.querySelector(`#translation-${index}`);
    td.classList.toggle('hidden-text');
    let icon = document.querySelector(`#show-icon-${index}`);
    icon.classList.toggle('bi-eye-fill');
    icon.classList.toggle('bi-eye-slash-fill');
  }

  get studentId() {
    return this.wordSearchForm.get('studentId');
  }
}
