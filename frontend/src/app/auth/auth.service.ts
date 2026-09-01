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

  readonly userId$ = this.oidc.getPayloadFromIdToken().pipe(
    map((payload: any) => payload?.['sub'] as string | undefined)
  );

  readonly children$ = this.oidc.getPayloadFromIdToken().pipe(
    map((payload: any) => {
      const raw = payload?.['custom:children'] ?? '';
      return raw ? (raw as string).split(',').map((s: string) => s.trim()).filter(Boolean) : [];
    })
  );
}
