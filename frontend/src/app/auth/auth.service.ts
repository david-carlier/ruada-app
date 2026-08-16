import { Injectable, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private oidc = inject(OidcSecurityService);

  readonly isAdmin$ = this.oidc.getPayloadFromIdToken().pipe(
    map((payload: any) => (payload?.['cognito:groups'] ?? []).includes('admins'))
  );

  readonly token$ = this.oidc.getIdToken();
}
