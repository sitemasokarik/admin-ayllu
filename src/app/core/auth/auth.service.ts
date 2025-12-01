import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUserModel } from '../models/auth/auth-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'authUser';

  constructor(private readonly router: Router) {}

  get accessToken(): string | null {
    const user = this.getAuthUser();
    return user?.token ?? null;
  }

  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getAuthUser(): AuthUserModel | null {
    const userData = localStorage.getItem(this.AUTH_KEY);
    if (userData) {
      try {
        return JSON.parse(userData) as AuthUserModel;
      } catch {
        return null;
      }
    }
    return null;
  }

  setAuthUser(user: AuthUserModel): void {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(user));
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    this.router.navigate(['/sign-in']);
  }

  isTokenExpired(): boolean {
    const token = this.accessToken;
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }
}
