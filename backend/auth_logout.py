"""Handler for /auth/logout endpoint.

Terminates the user session by revoking the refresh token,
clearing the session cookie, and redirecting to Auth0's logout endpoint.
"""

from errors import LambdaResponse


def handle_auth_logout(event: dict, config) -> LambdaResponse:
    """Handle GET /auth/logout request.

    Performs logout by:
    1. Validating the current session to retrieve the refresh token
    2. Revoking the refresh token with Auth0
    3. Clearing the session cookie
    4. Redirecting to Auth0 /v2/logout

    Args:
        event: API Gateway event with session cookie.
        config: LambdaConfig with Auth0 and session settings.

    Returns:
        302 redirect to Auth0 logout endpoint with cleared session cookie.
    """
    raise NotImplementedError("Implemented in task 4.4")
