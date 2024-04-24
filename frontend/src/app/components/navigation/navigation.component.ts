import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faDoorOpen, faHouse } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { ScrollService } from 'src/app/services/scroll.service';

declare var bootstrap: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  @ViewChild('testModal') testModal: ElementRef;
  language: string = 'ua';
  isLoggedIn = false;
  houseIcon = faHouse;
  doorIcon = faDoorOpen;

  constructor(private ss: ScrollService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isUserLoggedIn$.subscribe((res) => {
      if (res === 'success') {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  onLanguageChange(selectedValue: string) {
    this.language = selectedValue;
  }

  scrollToSection(section: string) {
    this.ss.scrollToElement(section);
  }

  openModal() {
    this.testModal.nativeElement.show();
  }

  signOut() {
    this.authService.signOut();
  }

  // Used by offcanvas
  disableAutoScroll(e) {
    let myOffcanvas = document.getElementById('offcanvas-nav');
    let bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);

    e.preventDefault();
    e.stopPropagation();
    bsOffcanvas.toggle();
  }
  
}
