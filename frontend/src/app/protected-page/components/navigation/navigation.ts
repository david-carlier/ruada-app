import { Component, inject, Output, EventEmitter } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthService } from '../../../auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-navigation',
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation {
  private oidc = inject(OidcSecurityService);
  private authService = inject(AuthService);
  readonly isAdmin$ = this.authService.isAdmin$;

  readonly user$ = this.oidc.getIdToken().pipe(
    map(token => {
      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return { name: payload.username || payload.email || '', email: payload.email || '' };
      } catch { return null; }
    })
  );

  @Output() logoutClick = new EventEmitter<void>();

  menuOpen = false;
}
