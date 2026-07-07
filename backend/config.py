"""Configuration module for Lambda backend.

Reads all configuration from environment variables with sensible defaults
where appropriate.
"""

import os
from dataclasses import dataclass, field
from typing import List


@dataclass
class LambdaConfig:
    """Lambda configuration read from environment variables."""

    auth0_domain: str
    auth0_client_id: str
    auth0_client_secret: str
    auth0_audience: str
    auth0_algorithms: List[str]
    session_secret: str
    spa_base_url: str
    api_base_url: str
    inactivity_timeout_s: int
    absolute_timeout_s: int
    cookie_name: str
    cookie_max_age_s: int


def load_config() -> LambdaConfig:
    """Load configuration from environment variables.

    Required environment variables (no defaults):
        AUTH0_DOMAIN - Auth0 tenant domain (e.g., 'myapp.auth0.com')
        AUTH0_CLIENT_ID - Application client ID
        AUTH0_CLIENT_SECRET - Application client secret (confidential)
        AUTH0_AUDIENCE - API identifier
        SESSION_SECRET - Secret key for encrypting session cookies
        SPA_BASE_URL - CloudFront URL for redirects back to SPA
        API_BASE_URL - API Gateway URL for callback URL

    Optional environment variables (with defaults):
        AUTH0_ALGORITHMS - Comma-separated list of algorithms (default: 'RS256')
        INACTIVITY_TIMEOUT_S - Inactivity timeout in seconds (default: 1800 = 30 min)
        ABSOLUTE_TIMEOUT_S - Absolute session timeout in seconds (default: 259200 = 72 hours)
        COOKIE_NAME - Session cookie name (default: 'music_group_session')
        COOKIE_MAX_AGE_S - Cookie max age in seconds (default: 259200 = 72 hours)

    Raises:
        ValueError: If any required environment variable is missing.
    """
    required_vars = [
        "AUTH0_DOMAIN",
        "AUTH0_CLIENT_ID",
        "AUTH0_CLIENT_SECRET",
        "AUTH0_AUDIENCE",
        "SESSION_SECRET",
        "SPA_BASE_URL",
        "API_BASE_URL",
    ]

    missing = [var for var in required_vars if not os.environ.get(var)]
    if missing:
        raise ValueError(
            f"Missing required environment variables: {', '.join(missing)}"
        )

    algorithms_str = os.environ.get("AUTH0_ALGORITHMS", "RS256")
    algorithms = [alg.strip() for alg in algorithms_str.split(",")]

    return LambdaConfig(
        auth0_domain=os.environ["AUTH0_DOMAIN"],
        auth0_client_id=os.environ["AUTH0_CLIENT_ID"],
        auth0_client_secret=os.environ["AUTH0_CLIENT_SECRET"],
        auth0_audience=os.environ["AUTH0_AUDIENCE"],
        auth0_algorithms=algorithms,
        session_secret=os.environ["SESSION_SECRET"],
        spa_base_url=os.environ["SPA_BASE_URL"].rstrip("/"),
        api_base_url=os.environ["API_BASE_URL"].rstrip("/"),
        inactivity_timeout_s=int(os.environ.get("INACTIVITY_TIMEOUT_S", "1800")),
        absolute_timeout_s=int(os.environ.get("ABSOLUTE_TIMEOUT_S", "259200")),
        cookie_name=os.environ.get("COOKIE_NAME", "music_group_session"),
        cookie_max_age_s=int(os.environ.get("COOKIE_MAX_AGE_S", "259200")),
    )
