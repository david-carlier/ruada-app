import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly oidc = inject(OidcSecurityService, { optional: true });
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.oidc!.isAuthenticated$.subscribe(({ isAuthenticated }) => {
      if (isAuthenticated) this.router.navigate(['/']);
    });
  }

  login(): void {
    if (!this.isBrowser) return;
    this.oidc!.authorize();
  }
}
