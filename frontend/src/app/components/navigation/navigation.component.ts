import { Component, ElementRef, ViewChild } from '@angular/core';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent {
  @ViewChild('testModal') testModal: ElementRef;

  language: string = 'ua';

  constructor(private ss: ScrollService) {}

  onLanguageChange(selectedValue: string) {
    this.language = selectedValue;
  }

  scrollToSection(section: string) {
    this.ss.scrollToElement(section);
  }

  openModal() {
    this.testModal.nativeElement.show();
  }
}
