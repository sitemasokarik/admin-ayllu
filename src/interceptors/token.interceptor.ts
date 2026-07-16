import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {

        // Token expirado o inválido
        authService.logout();

        // Redirige al login
        router.navigate(['/sign-in']);
      }

      return throwError(() => error);
    })
  );
};
