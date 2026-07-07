"""Handler for /auth/callback endpoint.

Handles the Auth0 redirect after successful authentication. Validates
the state parameter, exchanges the authorization code for tokens,
verifies membership, and creates the session.
"""

from errors import LambdaResponse


def handle_auth_callback(event: dict, config) -> LambdaResponse:
    """Handle GET /auth/callback request.

    Processes the Auth0 callback by:
    1. Extracting code and state from query parameters
    2. Validating state against the stored auth state cookie
    3. Exchanging the authorization code for tokens
    4. Validating the ID token claims
    5. Verifying membership
    6. Creating a session and setting the session cookie
    7. Redirecting to the originally requested URL

    Args:
        event: API Gateway event with code and state query params.
        config: LambdaConfig with Auth0 and session settings.

    Returns:
        302 redirect to original URL with session cookie set,
        or error/unauthorized response.
    """
    raise NotImplementedError("Implemented in task 4.2")
