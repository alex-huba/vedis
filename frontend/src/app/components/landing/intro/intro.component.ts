import { Component } from '@angular/core';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css'],
})
export class IntroComponent {
  constructor(private ss: ScrollService) {}

  scrollToSection() {
    this.ss.scrollToElement('contact-form-section');
  }
}
