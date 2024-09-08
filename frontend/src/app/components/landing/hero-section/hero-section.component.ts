import { Component } from '@angular/core';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css'],
})
export class HeroSectionComponent {
  constructor(private ss: ScrollService) {}

  scrollToSection() {
    this.ss.scrollToElement('contact-form-section');
  }
}
