// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Enables Routing
    provideHttpClient(), // Enables HTTP calls (replaces Axios)
    provideAnimations(), // Required for Material UI animations
    provideToastr({
      // Global Toastr Configuration
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      timeOut: 3000, // Close after 3 seconds
      closeButton: true,
      progressBar: true,
    }),
    provideHttpClient(withInterceptors([authInterceptor])), // Attaching Auth Interceptor
  ],
};
