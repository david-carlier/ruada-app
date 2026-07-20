import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;

  const oidc = inject(OidcSecurityService);
  const router = inject(Router);

  return oidc.isAuthenticated$.pipe(
    map(({ isAuthenticated }) => isAuthenticated || router.createUrlTree(['/login']))
  );
};
