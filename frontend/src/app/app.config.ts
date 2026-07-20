import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideAppInitializer, inject, PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { provideAuth, OidcSecurityService } from 'angular-auth-oidc-client';
import { authConfig } from './auth/auth.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideAuth(authConfig),
    provideAppInitializer(() => {
      if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
      return inject(OidcSecurityService).checkAuth();
    }),
  ],
};
