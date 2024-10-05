import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faPowerOff, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { UserService } from 'src/app/services/user.service';

declare var bootstrap: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  @ViewChild('testModal') testModal: ElementRef;
  isLoggedIn = false;

  // User photo
  photoUrl: any;

  icons = {
    profile: faUser,
    signOut: faPowerOff,
  };

  constructor(
    private ss: ScrollService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isUserLoggedIn$.subscribe((res) => {
      if (res === 'success') {
        this.isLoggedIn = true;

        // Subscribe to photo updates
        this.userService.photoUrl$.subscribe((photoUrl) => {
          this.photoUrl = photoUrl;
        });

        // Load the current photo
        this.userService.getPhoto();
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  scrollToSection(section: string) {
    this.ss.scrollToElement(section);
  }

  openModal() {
    this.testModal.nativeElement.show();
  }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['']);
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
