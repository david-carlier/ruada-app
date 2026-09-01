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
    this.oidc.logoffLocal();
    window.location.href = `https://eu-west-1ytldlevlw.auth.eu-west-1.amazoncognito.com/logout?client_id=4lhit4sfgffdkvbdd5opa00d4f&logout_uri=${encodeURIComponent(window.location.origin)}`;
  }
}
