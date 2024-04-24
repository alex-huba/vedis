import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private url = "http://localhost:3001/post";
  posts$: Observable<any[]>;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.posts$ = this.fetchAll();
  }

  fetchAll(): Observable<any[]> {
    return this.http
      .get<any[]>(this.url, { responseType: "json" });
  }
}
