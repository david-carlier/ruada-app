"""Protected content route handlers.

Serves group content only to authenticated and authorized members.
All routes in this module require a valid session (enforced by the
session middleware in handler.py).
"""

from errors import LambdaResponse
from session import SessionData


def handle_content(event: dict, session: SessionData) -> LambdaResponse:
    """Handle GET /api/content request.

    Returns group content for authenticated members.

    Args:
        event: API Gateway event.
        session: Validated session data for the current user.

    Returns:
        200 with group content JSON.
    """
    raise NotImplementedError("Implemented in task 6.4")


def handle_members(event: dict, session: SessionData) -> LambdaResponse:
    """Handle GET /api/members request.

    Returns the member list for authenticated members.

    Args:
        event: API Gateway event.
        session: Validated session data for the current user.

    Returns:
        200 with member list JSON.
    """
    raise NotImplementedError("Implemented in task 6.4")
