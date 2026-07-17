import {AuthModule} from 'angular-auth-oidc-client';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_yTLDLeVlw',
        redirectUrl: 'https://d84l1y8p4kdic.cloudfront.net',
        clientId: '4lhit4sfgffdkvbdd5opa00d4f',
        scope: 'phone openid email',
        responseType: 'code'
      },
    }),
  ],
  exports: [AuthModule],
})