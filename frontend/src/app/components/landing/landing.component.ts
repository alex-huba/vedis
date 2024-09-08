import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent {
  // This variable controls the visibility of the button
  mybutton: HTMLElement | null = null;

  ngOnInit() {
    // Get the button element when the component initializes
    this.mybutton = document.getElementById('myBtn');
  }

  // Listen to the window scroll event
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (
      document.body.scrollTop > 1270 ||
      document.documentElement.scrollTop > 1270
    ) {
      if (this.mybutton) {
        this.mybutton.style.display = 'block';
      }
    } else {
      if (this.mybutton) {
        this.mybutton.style.display = 'none';
      }
    }
  }

  // Scroll to the top of the page when the button is clicked
  topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
