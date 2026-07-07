"""Main Lambda entry point.

Routes incoming API Gateway events to the appropriate handler based
on the request path. Auth routes are public (handle their own auth
logic), while all other routes require a valid session cookie and
pass through the session middleware pipeline.
"""

import json

from config import LambdaConfig, load_config
from errors import LambdaResponse, error_response, json_response


# Load config once at module level (reused across Lambda invocations)
_config: LambdaConfig = None


def get_config() -> LambdaConfig:
    """Get or initialize the Lambda configuration."""
    global _config
    if _config is None:
        _config = load_config()
    return _config


def lambda_handler(event: dict, context) -> dict:
    """AWS Lambda entry point for API Gateway proxy integration.

    Routes requests based on path:
    - /auth/* routes are handled by their respective auth modules
    - /health is a public health check endpoint
    - All other routes go through the session middleware pipeline

    Args:
        event: API Gateway proxy integration event.
        context: Lambda context (unused).

    Returns:
        API Gateway proxy integration response dict.
    """
    try:
        config = get_config()
        path = event.get("path", "")
        http_method = event.get("httpMethod", "GET")

        response = route_request(event, config, path, http_method)
        return response.to_api_gateway_response()

    except Exception:
        # Never expose internal errors
        return error_response(500, "Internal server error").to_api_gateway_response()


def route_request(event: dict, config: LambdaConfig, path: str, http_method: str) -> LambdaResponse:
    """Route request to the appropriate handler.

    Args:
        event: API Gateway event.
        config: Lambda configuration.
        path: Request path.
        http_method: HTTP method.

    Returns:
        LambdaResponse from the appropriate handler.
    """
    # Health check (public)
    if path == "/health":
        return json_response(200, {"status": "healthy"})

    # Auth routes (public - handle their own auth logic)
    if path.startswith("/auth/"):
        return route_auth_request(event, config, path)

    # All other routes require session middleware
    return handle_protected_request(event, config)


def route_auth_request(event: dict, config: LambdaConfig, path: str) -> LambdaResponse:
    """Route auth-related requests to the appropriate handler.

    Args:
        event: API Gateway event.
        config: Lambda configuration.
        path: Request path.

    Returns:
        LambdaResponse from the appropriate auth handler.
    """
    raise NotImplementedError("Auth routing implemented in task 6.3")


def handle_protected_request(event: dict, config: LambdaConfig) -> LambdaResponse:
    """Process a request through the session middleware pipeline.

    Pipeline:
    1. Validate session cookie
    2. Check session timeouts (inactivity + absolute)
    3. Refresh access token if expired (transparent to frontend)
    4. Verify membership on each request
    5. Update last activity timestamp
    6. Route to appropriate handler

    Args:
        event: API Gateway event.
        config: Lambda configuration.

    Returns:
        LambdaResponse from the protected route handler, or auth error.
    """
    raise NotImplementedError("Session middleware implemented in task 6.1")
