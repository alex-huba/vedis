import { HttpEventType } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as confetti from 'canvas-confetti';
import { LangTestService } from 'src/app/services/lang-test.service';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-english-test',
  templateUrl: './english-test.component.html',
  styleUrls: ['./english-test.component.css'],
})
export class EnglishTestComponent implements AfterViewInit {
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
    level: 'С2',
    score: '100',
  };

  constructor(
    private fb: FormBuilder,
    private ls: LangTestService,
    private ss: ScrollService
  ) {}

  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
  }

  onSubmit() {
    if (this.questions.invalid) {
      this.questions.markAllAsTouched();
    } else {
      this.ls.checkLvl(this.questions.value, "eng").subscribe({
        next: (event) => {
          switch (event.type) {
            case HttpEventType.Sent:
              this.awaitingResponse = true;
              break;
            case HttpEventType.Response:
              this.awaitingResponse = false;
              this.testResult.level = (event.body as any).level;
              this.testResult.score = (event.body as any).score;
              this.isTestSolved = true;
              this.surprise();
              break;
          }
        },
        error: (err) => {
          this.awaitingResponse = false;
        },
      });
    }
  }

  surprise(): void {
    const testElem = document.getElementById('test');
    testElem.scrollIntoView({ behavior: 'smooth' });

    let canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.left = '50%';
    canvas.style.transform = 'translateX(-50%)';

    let vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    if (vw < 770) {
      canvas.style.top = '5%';
      canvas.style.width = '80%';
    } else {
      canvas.style.top = '10%';
      canvas.style.width = '50%';
    }

    testElem.appendChild(canvas);

    const myConfetti = confetti.create(canvas, {
      resize: true,
    });

    myConfetti({
      particleCount: 300,
      startVelocity: 30,
      spread: 80,
    });
  }

  registerForClasses() {
    this.ss.navigateAndScroll('', 'contact-section');
  }
}
