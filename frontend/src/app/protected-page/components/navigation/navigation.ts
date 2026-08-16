import { Component, inject, Output, EventEmitter } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-navigation',
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation {
  private oidc = inject(OidcSecurityService);
  private authService = inject(AuthService);
  readonly user$ = this.oidc.getUserData();
  readonly isAdmin$ = this.authService.isAdmin$;

  @Output() logoutClick = new EventEmitter<void>();

  menuOpen = false;
}
