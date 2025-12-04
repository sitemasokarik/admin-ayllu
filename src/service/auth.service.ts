import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://caeteringdcodepe.runasp.net/api/v1/usuario';
  private API_URL_ROL = 'http://caeteringdcodepe.runasp.net/api/v1/rol';
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';
  private readonly EXPIRES_KEY = 'expires_at';

  constructor(private http: HttpClient) {}

  login(credentials: { userName: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials);
  }
  getRolById(id: number) {
     return this.http.get(`${this.API_URL_ROL}/getbyid/${id}`);
  }
  // Token
  saveToken(token: string): void {
    const expiresAt = Date.now() + (30 * 60 * 1000); // 30 min

    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.EXPIRES_KEY, expiresAt.toString());
  }

  isTokenExpired(): boolean {
    const expires = localStorage.getItem(this.EXPIRES_KEY);
    if (!expires) return true;

    return Date.now() > Number(expires);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    return !this.isTokenExpired();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Usuario logueado
  saveUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.EXPIRES_KEY); // ← IMPORTANTE
  }
}
