import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

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
    phoneNumber: '',
    role: 'init', // Can be: ["init", "student", "teacher"]
    timezone: '',
  };
  private userSubject = new BehaviorSubject<any>(this.userStub);
  currentUser$ = this.userSubject.asObservable();

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
        tap((res: any) => {
          localStorage.setItem('token', res.token);
          this.loginStatus$.next('success');
          this.userSubject.next(res.user);
          this.router.navigate(['/home']);
        }),
        catchError(this.handleError)
      );
  }

  signup(
    name: string,
    email: string,
    password: string,
    phone: any,
    timezone: string
  ): Observable<any> {
    const req = new HttpRequest(
      'POST',
      `${this.url}/signup`,
      {
        name: name,
        email: email,
        password: password,
        phoneNumber: phone.e164Number,
        timezone: timezone,
      },
      this.options
    );
    return this.http.request(req);
  }

  verifyToken() {
    return this.http
      .post<any>(
        `${this.url}/verification`,
        {
          token: localStorage.getItem('token'),
        },
        this.httpOptions
      )
      .pipe(
        tap((res) => {
          this.loginStatus$.next('success');
          this.userSubject.next(res.user);
        }),
        catchError((err) => {
          this.loginStatus$.next('failure');
          return [];
        })
      );
  }

  signOut() {
    localStorage.removeItem('token');
    this.loginStatus$.next('failure');
  }

  updateUserDetails(details) {
    this.userSubject.next(details);
  }

  forgotPassword(email): Observable<any> {
    return this.http.post<any>(
      `${this.url}/forgot/password`,
      { email },
      {
        ...this.httpOptions,
        reportProgress: true,
      }
    );
  }

  resetPassword(id, token, password) {
    return this.http.post<any>(
      `${this.url}/reset/password/${id}/${token}`,
      {
        password,
      },
      {
        ...this.httpOptions,
        reportProgress: true,
      }
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error.message || 'Error occurred on the server';
    }
    return throwError(() => new Error(errorMessage));
  }
}
