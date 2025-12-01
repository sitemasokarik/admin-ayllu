import {
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, catchError, throwError } from 'rxjs';

/**
 * Interceptor de autenticación
 * Agrega el token JWT a todas las peticiones HTTP
 * Maneja errores de autenticación (401, 403)
 */
export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);

    let newReq = req.clone();

    // Agregar token si existe y no ha expirado
    const token = authService.accessToken;
    if (token && !authService.isTokenExpired()) {
        newReq = req.clone({
            headers: req.headers.set(
                'Authorization',
                'Bearer ' + token
            ),
        });
    }

    // Procesar la petición y manejar errores
    return next(newReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // Si el servidor responde con 401 (No autorizado) o 403 (Prohibido)
            if (error.status === 401 || error.status === 403) {
                // Limpiar sesión y redirigir al login
                authService.logout();
            }
            return throwError(() => error);
        })
    );
};
