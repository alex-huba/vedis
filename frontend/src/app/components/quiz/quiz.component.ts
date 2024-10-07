import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent {
  @Input() languageToTest = '';
  @Input() question = [];
  @Input() answers = [];
  @Input() questionIndex = 0;
  @Input() formLength = 0;
  @Input() formField = '';

  @Output() selectedAnswer = new EventEmitter<{
    field: string;
    answer: string;
  }>();

  selectAnswer(field, answer) {
    this.selectedAnswer.emit({ field: field, answer: answer });
  }

  get progressRatio() {
    return (this.questionIndex / this.formLength) * 100;
  }
}
