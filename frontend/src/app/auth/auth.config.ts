import { PassedInitialConfig } from 'angular-auth-oidc-client';

const origin = typeof window !== 'undefined' ? window.location.origin : 'https://d28hzxqwm7qapp.cloudfront.net';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_tJ18X0zlF',
    redirectUrl: origin,
    postLogoutRedirectUri: origin,
    customParamsEndSessionRequest: {
      logout_uri: origin,
    },
    clientId: '4ajv3772383fh1jn9srm84etnj',
    scope: 'phone openid email profile',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    renewTimeBeforeTokenExpiresInSeconds: 30,
  },
};
