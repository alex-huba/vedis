import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  faBars,
  faDoorOpen,
  faFolderPlus,
  faHouse,
  faListCheck,
  faSquarePen,
} from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private url = 'http://localhost:3001/post';
  posts$: Observable<any[]>;

  // User details
  isTeacher = false;
  username = '';

  toggleIcon = faBars;
  houseIcon = faHouse;
  taskIcon = faListCheck;
  doorIcon = faDoorOpen;
  folderIcon = faFolderPlus;
  penIcon = faSquarePen;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.posts$ = this.fetchAll();
    this.authService.currentUser$.subscribe((user) => {
      // Check user role
      if (user.role === 'teacher') {
        this.isTeacher = true;
      } else {
        this.isTeacher = false;
      }

      // Get username
      this.username = user.name;
    });
  }

  fetchAll(): Observable<any[]> {
    return this.http.get<any[]>(this.url, { responseType: 'json' });
  }

  signOut() {
    this.authService.signOut();
  }

  renderCalendar() {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 200);
  }
}
