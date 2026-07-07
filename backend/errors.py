"""Centralized error handling for the Lambda backend.

Ensures no content leaks on authentication or authorization failures.
All error responses follow a consistent structure and never expose
internal details or group content.
"""

import json
from dataclasses import dataclass
from typing import Optional


@dataclass
class LambdaResponse:
    """Standard Lambda response structure for API Gateway integration."""

    status_code: int
    headers: dict
    body: str

    def to_api_gateway_response(self) -> dict:
        """Convert to API Gateway proxy integration response format."""
        return {
            "statusCode": self.status_code,
            "headers": self.headers,
            "body": self.body,
        }


def error_response(status_code: int, message: str) -> LambdaResponse:
    """Create a generic error response with no content leakage."""
    return LambdaResponse(
        status_code=status_code,
        headers={"Content-Type": "application/json"},
        body=json.dumps({"error": message}),
    )


def unauthorized_response(cookie_headers: Optional[dict] = None) -> LambdaResponse:
    """Create a 401 response, optionally clearing the session cookie."""
    headers = {"Content-Type": "application/json"}
    if cookie_headers:
        headers.update(cookie_headers)
    return LambdaResponse(
        status_code=401,
        headers=headers,
        body=json.dumps({"error": "Unauthorized"}),
    )


def forbidden_response(cookie_headers: Optional[dict] = None) -> LambdaResponse:
    """Create a 403 response for authenticated but unauthorized users."""
    headers = {"Content-Type": "application/json"}
    if cookie_headers:
        headers.update(cookie_headers)
    return LambdaResponse(
        status_code=403,
        headers=headers,
        body=json.dumps({"error": "Forbidden", "message": "User is not authorized"}),
    )


def redirect_response(url: str, *extra_headers: Optional[dict]) -> LambdaResponse:
    """Create a 302 redirect response with optional extra headers (e.g., cookies)."""
    headers = {"Location": url}
    for h in extra_headers:
        if h:
            headers.update(h)
    return LambdaResponse(
        status_code=302,
        headers=headers,
        body="",
    )


def json_response(status_code: int, data: dict) -> LambdaResponse:
    """Create a JSON response with the given status code and data."""
    return LambdaResponse(
        status_code=status_code,
        headers={"Content-Type": "application/json"},
        body=json.dumps(data),
    )


def session_expired_response(cookie_headers: Optional[dict] = None) -> LambdaResponse:
    """Create a 401 response indicating the session has expired."""
    headers = {"Content-Type": "application/json"}
    if cookie_headers:
        headers.update(cookie_headers)
    return LambdaResponse(
        status_code=401,
        headers=headers,
        body=json.dumps({"error": "Session expired"}),
    )
