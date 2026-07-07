"""OAuth2 client for Auth0 interactions.

Handles PKCE generation, token exchange, token refresh, and token
revocation. All communication with Auth0 happens server-side through
this module.
"""

from dataclasses import dataclass


@dataclass
class AuthState:
    """OAuth2 PKCE state stored temporarily during auth flow."""

    state: str
    code_verifier: str
    redirect_url: str
    created_at: int


@dataclass
class TokenExchangeRequest:
    """Request parameters for exchanging an authorization code for tokens."""

    code: str
    code_verifier: str
    redirect_uri: str


@dataclass
class TokenResponse:
    """Token response from Auth0 /oauth/token endpoint."""

    access_token: str
    refresh_token: str
    id_token: str
    token_type: str
    expires_in: int


def generate_code_verifier() -> str:
    """Generate a cryptographically random PKCE code verifier (43-128 chars).

    Returns:
        A random URL-safe string suitable as a PKCE code_verifier.
    """
    raise NotImplementedError("Implemented in task 3.1")


def generate_code_challenge(code_verifier: str) -> str:
    """Generate PKCE code challenge from code verifier (SHA256 + base64url).

    Args:
        code_verifier: The PKCE code verifier string.

    Returns:
        Base64url-encoded SHA256 hash of the code verifier.
    """
    raise NotImplementedError("Implemented in task 3.1")


def generate_random_state() -> str:
    """Generate a cryptographically random state parameter for CSRF protection.

    Returns:
        A random URL-safe string for the OAuth2 state parameter.
    """
    raise NotImplementedError("Implemented in task 3.1")


def build_authorize_url(config, state: str, code_challenge: str, redirect_url: str) -> str:
    """Build the Auth0 /authorize URL with all required parameters.

    Args:
        config: LambdaConfig with Auth0 settings.
        state: Random state parameter.
        code_challenge: PKCE code challenge.
        redirect_url: URL to redirect to after auth.

    Returns:
        Complete Auth0 authorization URL.
    """
    raise NotImplementedError("Implemented in task 3.1")


def exchange_code_for_tokens(config, request: TokenExchangeRequest) -> TokenResponse:
    """Exchange an authorization code for tokens with Auth0.

    Args:
        config: LambdaConfig with Auth0 settings.
        request: Token exchange request parameters.

    Returns:
        TokenResponse with access, refresh, and ID tokens.

    Raises:
        Exception: If token exchange fails.
    """
    raise NotImplementedError("Implemented in task 3.1")


def refresh_access_token(config, refresh_token: str) -> TokenResponse:
    """Refresh an access token using a refresh token.

    Args:
        config: LambdaConfig with Auth0 settings.
        refresh_token: Current refresh token.

    Returns:
        TokenResponse with new access token (and possibly rotated refresh token).

    Raises:
        Exception: If token refresh fails (e.g., refresh token revoked).
    """
    raise NotImplementedError("Implemented in task 3.1")


def revoke_refresh_token(config, refresh_token: str) -> None:
    """Revoke a refresh token with Auth0.

    Args:
        config: LambdaConfig with Auth0 settings.
        refresh_token: The refresh token to revoke.
    """
    raise NotImplementedError("Implemented in task 3.1")


def build_logout_url(config) -> str:
    """Build the Auth0 /v2/logout URL.

    Args:
        config: LambdaConfig with Auth0 settings.

    Returns:
        Complete Auth0 logout URL with returnTo parameter.
    """
    raise NotImplementedError("Implemented in task 3.1")
