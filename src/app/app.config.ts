import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { TokenInterceptor } from '../interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 👉 Routing
    provideRouter(routes),

    // 👉 HttpClient + Interceptor para el token
    provideHttpClient(
      withInterceptors([TokenInterceptor])
    )
  ]
};
