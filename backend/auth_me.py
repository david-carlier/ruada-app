"""Handler for /auth/me endpoint.

Validates the session cookie and returns the current user's info
if the session is valid, or 401 if not authenticated.
"""

from errors import LambdaResponse


def handle_auth_me(event: dict, config) -> LambdaResponse:
    """Handle GET /auth/me request.

    Validates the session cookie and returns user information:
    - userId, email, name if session is valid
    - 401 Unauthorized with cleared cookie if session is invalid

    Args:
        event: API Gateway event with session cookie in headers.
        config: LambdaConfig with session settings.

    Returns:
        200 with user info JSON, or 401 with cleared session cookie.
    """
    raise NotImplementedError("Implemented in task 4.3")
