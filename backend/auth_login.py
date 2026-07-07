"""Handler for /auth/login endpoint.

Initiates the OAuth2 Authorization Code Flow with PKCE by generating
PKCE parameters, storing auth state in a short-lived cookie, and
redirecting the user to Auth0's /authorize endpoint.
"""

from errors import LambdaResponse


def handle_auth_login(event: dict, config) -> LambdaResponse:
    """Handle GET /auth/login request.

    Generates PKCE code_verifier and code_challenge, stores state in
    an encrypted short-lived cookie, and redirects to Auth0 /authorize.

    Args:
        event: API Gateway event with optional redirect_url query param.
        config: LambdaConfig with Auth0 and session settings.

    Returns:
        302 redirect to Auth0 authorization endpoint.
    """
    raise NotImplementedError("Implemented in task 4.1")
