import { HttpEventType } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { englishQuiz } from 'src/app/models/english-questions';
import { LangTestService } from 'src/app/services/lang-test.service';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-english-test',
  templateUrl: './english-test.component.html',
  styleUrls: ['./english-test.component.css'],
})
export class EnglishTestComponent implements AfterViewInit, OnInit {
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

  // Used by submit button for showing loading spinner
  awaitingResponse = false;

  // True on response code 200
  isTestSolved = false;

  // Will be populated with server response
  testResult = {
    level: 'C1: Advanced',
    score: '100 / 100',
    description:
      'Ти вільно говориш і розумієш майже все. Можеш обговорювати складні теми та висловлювати свої думки без зусиль.',
  };

  isQuizStarted = false;

  formLength = 0;

  languageToTest = 'англійської';

  questionIndex = 1;

  question = [];

  answers = [];

  isQuizFinished = false;

  formField = '';

  constructor(
    private fb: FormBuilder,
    private ls: LangTestService,
    private ss: ScrollService
  ) {}

  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }

  ngOnInit() {
    const currentTask = englishQuiz.find((q) => q.index == this.questionIndex);
    this.question = currentTask.question;
    this.answers = currentTask.answers;
    this.formField = currentTask.field;
    this.formLength = englishQuiz.length;
  }

  registerForClasses() {
    this.ss.navigateAndScroll('', 'contact-section');
  }

  startQuiz() {
    this.isQuizStarted = true;
  }

  processAnswer(event: { field: string; answer: string }) {
    const control = this.questions.get(event.field);
    if (control) control.patchValue(event.answer);

    this.questionIndex++;
    if (this.questionIndex > this.formLength) {
      this.questionIndex--;
      this.isQuizFinished = true;
      if (this.questions.invalid) {
        this.questions.markAllAsTouched();
      } else {
        this.ls.checkLvl(this.questions.value, 'eng').subscribe({
          next: (event) => {
            switch (event.type) {
              case HttpEventType.Sent:
                this.awaitingResponse = true;
                break;
              case HttpEventType.Response:
                this.awaitingResponse = false;
                this.testResult.level = (event.body as any).level;
                this.testResult.score = (event.body as any).score;
                this.testResult.description = (event.body as any).description;
                this.isTestSolved = true;
                break;
            }
          },
          error: () => {
            this.awaitingResponse = false;
          },
        });
      }
    } else {
      const task = englishQuiz.find((q) => q.index == this.questionIndex);
      this.question = task.question;
      this.answers = task.answers;
      this.formField = task.field;
    }
  }
}
