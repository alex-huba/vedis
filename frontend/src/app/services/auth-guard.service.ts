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
export class AuthGuardService {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next, state): Observable<boolean> {
    return this.authService.isUserLoggedIn$.pipe(
      filter((action) => action === 'success' || action === 'failure'),
      map((action) => {
        if (action !== 'success') {
          this.router.navigate(['login']);
        }
        return action === 'success';
      })
    );
  }
}

export const AuthGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  return inject(AuthGuardService).canActivate(next, state);
};
