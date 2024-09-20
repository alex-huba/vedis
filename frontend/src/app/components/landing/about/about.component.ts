import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements AfterViewInit {
  @ViewChildren('scrollElement') scrollElements!: QueryList<ElementRef>;

  // Function to check if an element is in the viewport (adjusted for mobile)
  isInViewport(el: HTMLElement): boolean {
    const rect = el.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Adjust this condition to make the animation trigger earlier
    return rect.top <= windowHeight * 0.7 && rect.bottom >= 0;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.checkElementsInView();
  }

  ngAfterViewInit() {
    this.checkElementsInView();
  }

  checkElementsInView() {
    this.scrollElements.forEach((element) => {
      const nativeElement = element.nativeElement;
      if (this.isInViewport(nativeElement)) {
        nativeElement.classList.add('active');
      }
    });
  }
}
