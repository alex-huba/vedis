import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {}

  scrollToElement(elementId: string) {
    const element = this.document.getElementById(elementId);
    if (element) {
      const headerOffset = 100;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  navigateAndScroll(link: string, elementId: string) {
    this.router.navigate([link]).then(() => {
      this.scrollToElement(elementId);
    });
  }
}
