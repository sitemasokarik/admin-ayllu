import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  // Verificar si hay token y no ha expirado
  if (authService.isAuthenticated && !authService.isTokenExpired()) {
    return true;
  }

  // Si no hay token o expiró, limpiar sesión y redirigir al login
  authService.logout();
  return false;
};

export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya está autenticado, redirigir al home
  if (authService.isAuthenticated && !authService.isTokenExpired()) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
