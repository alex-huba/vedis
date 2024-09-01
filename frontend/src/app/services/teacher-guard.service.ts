import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TeacherGuardService {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next, state): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      filter((user) => user.role !== 'init'),
      map((user) => {
        if (user.role !== 'teacher') {
          this.router.navigate(['home']);
        }
        return user.role === 'teacher';
      })
    );
  }
}

export const AuthGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  return inject(TeacherGuardService).canActivate(next, state);
};
