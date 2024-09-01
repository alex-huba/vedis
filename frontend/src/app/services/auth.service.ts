import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, first, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Can be: ["init", "success", "failure"]
  private loginStatus$ = new BehaviorSubject<string>('init');
  isUserLoggedIn$ = this.loginStatus$.asObservable();

  private userStub = {
    id: '',
    name: '',
    email: '',
    role: 'init', // Can be: ["init", "student", "teacher"]
  };
  private userSubject$ = new BehaviorSubject<any>(this.userStub);
  currentUser$ = this.userSubject$.asObservable();

  private url = 'http://localhost:3001/auth';

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private options = {
    ...this.httpOptions,
    reportProgress: true,
  };

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(
        `${this.url}/login`,
        { email, password },
        {
          ...this.httpOptions,
          reportProgress: true,
        }
      )
      .pipe(
        first(),
        tap((res: any) => {
          localStorage.setItem('token', res.token);
          this.loginStatus$.next('success');
          this.userSubject$.next(res.user);
          this.router.navigate(['/home']);
        })
      );
  }

  signup(
    name: string,
    email: string,
    password: string,
    phone: any
  ): Observable<any> {
    const reqBody = {
      name: name,
      email: email,
      password: password,
      phone: phone.internationalNumber,
    };

    const req = new HttpRequest(
      'POST',
      `${this.url}/signup`,
      reqBody,
      this.options
    );
    return this.http.request(req);
  }

  verifyToken() {
    return this.http
      .post<any>(
        `${this.url}/verifyToken`,
        {
          token: localStorage.getItem('token'),
        },
        this.httpOptions
      )
      .pipe(
        tap((res) => {
          this.loginStatus$.next('success');
          this.userSubject$.next(res.user);
        }),
        catchError((err) => {
          this.loginStatus$.next('failure');
          return [];
        })
      );
  }

  signOut() {
    localStorage.removeItem('token');
    this.router.navigate(['']);
    this.loginStatus$.next('failure');
  }
}
