import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, AsyncPipe, JsonPipe } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-home.component',
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly oidc = isPlatformBrowser(inject(PLATFORM_ID)) ? inject(OidcSecurityService) : null;
  readonly tokens$ = this.oidc?.getAuthenticationResult();
  readonly user$ = this.oidc?.getUserData();
}
