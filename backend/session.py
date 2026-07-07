"""Session management module.

Handles session cookie creation, validation, encryption/decryption,
and timeout checks. Tokens are stored encrypted in the session cookie
and are never exposed to the browser.
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class SessionData:
    """Session data stored encrypted in the session cookie."""

    user_id: str
    email: str
    name: str
    access_token: str
    refresh_token: str
    token_expires_at: int
    session_created_at: int
    last_activity_at: int


@dataclass
class SessionValidationResult:
    """Result of validating a session cookie."""

    is_valid: bool
    session: Optional[SessionData]
    error: Optional[str]
    reason: Optional[str]  # 'expired', 'inactive', 'invalid', 'missing'


def create_session_cookie(session: SessionData, config) -> dict:
    """Encrypt session data and return Set-Cookie header dict.

    Args:
        session: The session data to encrypt and store.
        config: LambdaConfig with session_secret and cookie settings.

    Returns:
        Dict with Set-Cookie header.
    """
    raise NotImplementedError("Implemented in task 2.1")


def validate_session(event: dict, config) -> SessionValidationResult:
    """Validate the session cookie from an API Gateway event.

    Args:
        event: API Gateway event containing headers with cookies.
        config: LambdaConfig with session_secret and cookie settings.

    Returns:
        SessionValidationResult indicating validity and decoded session.
    """
    raise NotImplementedError("Implemented in task 2.1")


def clear_session_cookie(config) -> dict:
    """Return headers that clear the session cookie.

    Args:
        config: LambdaConfig with cookie_name.

    Returns:
        Dict with Set-Cookie header that expires the cookie.
    """
    raise NotImplementedError("Implemented in task 2.1")


def is_inactive_timeout(session: SessionData, inactivity_timeout_s: int) -> bool:
    """Check if session has exceeded the inactivity timeout.

    Args:
        session: Current session data.
        inactivity_timeout_s: Maximum allowed inactivity in seconds.

    Returns:
        True if session is inactive beyond the threshold.
    """
    raise NotImplementedError("Implemented in task 2.2")


def is_absolute_timeout(session: SessionData, absolute_timeout_s: int) -> bool:
    """Check if session has exceeded the absolute timeout.

    Args:
        session: Current session data.
        absolute_timeout_s: Maximum session lifetime in seconds.

    Returns:
        True if session has exceeded absolute lifetime.
    """
    raise NotImplementedError("Implemented in task 2.2")


def is_token_expired(session: SessionData) -> bool:
    """Check if the access token in the session has expired.

    Args:
        session: Current session data.

    Returns:
        True if the access token has expired.
    """
    raise NotImplementedError("Implemented in task 2.2")
