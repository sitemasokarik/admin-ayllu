import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://caeteringdcodepe.runasp.net/api/v1/usuario';

  constructor(private http: HttpClient) {}

  login(credentials: { userName: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
