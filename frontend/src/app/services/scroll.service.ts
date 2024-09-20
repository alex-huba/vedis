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
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  navigateAndScroll(link: string, elementId: string) {
    this.router.navigate([link]).then(() => {
      this.scrollToElement(elementId);
    });
  }
}
