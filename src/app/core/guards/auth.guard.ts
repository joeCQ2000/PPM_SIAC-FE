import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) {}

  private check(): Observable<boolean | UrlTree> {
    return this.auth.isAuthenticated$().pipe(
      map(isAuth => isAuth ? true : this.router.createUrlTree(['/auth/login'])),
      catchError(() => of(this.router.createUrlTree(['/auth/login'])))
    );
  }

  canActivate(): Observable<boolean | UrlTree> { return this.check(); }
  canLoad(): Observable<boolean | UrlTree> { return this.check(); }
}