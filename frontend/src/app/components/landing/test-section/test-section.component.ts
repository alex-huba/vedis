import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-test-section',
  templateUrl: './test-section.component.html',
  styleUrls: ['./test-section.component.css'],
})
export class TestSectionComponent implements OnInit, OnDestroy {
  private bodyElement: HTMLElement;
  private observer: MutationObserver;

  ngOnInit(): void {
    this.bodyElement = document.body;

    // Create the MutationObserver instance
    this.observer = new MutationObserver(() => {
      this.checkBodyClass();
    });

    // Start observing the body element for class changes
    this.observer.observe(this.bodyElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  checkBodyClass(): void {
    if (this.bodyElement.classList.contains('modal-open')) {
      // If body has class 'modal-open', disable scroll
      document.documentElement.style.overflowY = 'hidden';
    } else {
      // Otherwise, enable scroll
      document.documentElement.style.overflowY = 'auto';
    }
  }

  ngOnDestroy(): void {
    // Properly disconnect the observer when the component is destroyed
    if (this.observer) {
      this.observer.disconnect();
    }

    // Reset the overflow style if needed
    document.documentElement.style.overflowY = 'auto';
  }
}
