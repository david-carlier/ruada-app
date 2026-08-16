import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly oidc = this.isBrowser ? inject(OidcSecurityService) : null;
  private readonly router = inject(Router);

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
