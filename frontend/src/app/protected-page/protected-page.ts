import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Navigation } from './components/navigation/navigation';

@Component({
  selector: 'app-protected-page',
  imports: [RouterOutlet, Navigation],
  templateUrl: './protected-page.html',
})
export class ProtectedPageComponent {
  private oidc = inject(OidcSecurityService);

  logout() {
    this.oidc.logoff().subscribe();
  }
}
