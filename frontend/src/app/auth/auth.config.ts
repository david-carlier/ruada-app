import { PassedInitialConfig } from 'angular-auth-oidc-client';

const origin = typeof window !== 'undefined' ? window.location.origin : 'https://d84l1y8p4kdic.cloudfront.net';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_yTLDLeVlw',
    redirectUrl: origin,
    postLogoutRedirectUri: origin,
    clientId: '4lhit4sfgffdkvbdd5opa00d4f',
    scope: 'phone openid email',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    renewTimeBeforeTokenExpiresInSeconds: 30,
  },
};
