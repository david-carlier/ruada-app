# Implementation Plan: Music Group App

## Overview

Implement a private music group web application using a React SPA frontend (hosted on S3 + CloudFront) and a Python Lambda backend acting as a BFF (Backend for Frontend). All Auth0 communication is handled exclusively by the backend. The frontend uses session cookies only — no tokens are ever exposed to the browser.

## Tasks

- [x] 1. Set up project structure and core interfaces
  - [x] 1.1 Create Python Lambda backend project structure
    - Create `backend/` directory with `handler.py`, `config.py`, `errors.py`, `session.py`, `oauth_client.py`, `membership.py`, `auth_login.py`, `auth_callback.py`, `auth_logout.py`, `auth_me.py`, `routes.py`
    - Add `requirements.txt` with dependencies: `cryptography`, `PyJWT`, `jwcrypto`, `requests`
    - Define dataclasses for `LambdaConfig`, `SessionData`, `SessionValidationResult`, `AuthState`, `TokenExchangeRequest`, `TokenResponse`, `MembershipResult`, `LambdaResponse`
    - Implement `config.py` reading from environment variables
    - _Requirements: 1.5, 5.1, 5.2_

  - [x] 1.2 Create React SPA frontend project structure
    - Initialize React project with TypeScript using Vite
    - Create `src/` directory structure: `components/`, `context/`, `pages/`, `utils/`
    - Define TypeScript interfaces: `SessionState`, `UserInfo`
    - Create `ApiClient` utility with `credentials: 'include'` for all requests
    - Set up Vitest as the test runner
    - _Requirements: 1.1, 4.1_

- [ ] 2. Implement backend session management
  - [ ] 2.1 Implement session cookie encryption and decryption
    - Implement `session.py` with `create_session_cookie()`, `validate_session()`, `clear_session_cookie()`
    - Use `cryptography` library (Fernet) for symmetric encryption of session data
    - Configure cookie attributes: HTTP-only, Secure, SameSite=Lax, path="/", max_age=259200
    - Implement session data serialization/deserialization (JSON inside encrypted blob)
    - _Requirements: 5.1, 5.2_

  - [ ] 2.2 Implement session timeout validation
    - Implement `is_inactive_timeout()` checking 30-minute inactivity window
    - Implement `is_absolute_timeout()` checking 72-hour absolute session lifetime
    - Implement `is_token_expired()` checking access token expiration timestamp
    - Update `last_activity_at` on each valid request
    - _Requirements: 2.5, 2.6_

  - [ ]* 2.3 Write property test for session timeout enforcement (Property 5)
    - **Property 5: Session timeout enforcement**
    - Generate random timestamps around 30-minute and 72-hour boundaries using Hypothesis
    - Verify sessions exceeding either threshold are always terminated
    - **Validates: Requirements 2.5, 2.6**

  - [ ]* 2.4 Write property test for invalid session rejection (Property 9)
    - **Property 9: Invalid session rejection with no content**
    - Generate corrupted cookies, expired tokens, wrong issuer/audience using Hypothesis
    - Verify all invalid sessions return empty body + clear cookie + 401
    - **Validates: Requirements 5.3, 5.4**

- [ ] 3. Implement backend OAuth2 client and PKCE
  - [ ] 3.1 Implement OAuth2 PKCE utilities in `oauth_client.py`
    - Implement `generate_code_verifier()` (43-128 character random string)
    - Implement `generate_code_challenge()` (SHA256 + base64url of verifier)
    - Implement `generate_random_state()` for CSRF protection
    - Implement `build_authorize_url()` constructing Auth0 `/authorize` URL with all params
    - Implement `exchange_code_for_tokens()` calling Auth0 `/oauth/token` with code + code_verifier + client_secret
    - Implement `refresh_access_token()` using refresh_token grant type
    - Implement `revoke_refresh_token()` calling Auth0 `/oauth/revoke`
    - Implement `build_logout_url()` constructing Auth0 `/v2/logout` URL
    - _Requirements: 1.2, 2.2, 5.2_

  - [ ]* 3.2 Write unit tests for PKCE generation
    - Verify code_challenge is SHA256 of code_verifier (base64url encoded)
    - Verify code_verifier length is within 43-128 characters
    - Verify state is cryptographically random
    - _Requirements: 5.2_

- [ ] 4. Implement backend auth endpoint handlers
  - [ ] 4.1 Implement `/auth/login` handler in `auth_login.py`
    - Accept optional `redirect_url` query parameter
    - Generate PKCE code_verifier and code_challenge
    - Store auth state (state, code_verifier, redirect_url) in short-lived encrypted cookie (5 min max_age)
    - Return 302 redirect to Auth0 `/authorize` URL with PKCE params
    - _Requirements: 1.1, 1.3_

  - [ ] 4.2 Implement `/auth/callback` handler in `auth_callback.py`
    - Extract `code` and `state` from query parameters
    - Retrieve and validate auth state from cookie, verify state matches
    - Exchange authorization code for tokens via `oauth_client.py`
    - Validate ID token claims (signature, issuer, audience)
    - Call membership check — redirect to `/unauthorized` if not a member
    - Create session with all token data, set session cookie
    - Clear auth state cookie and redirect to stored `redirect_url` or default landing page
    - _Requirements: 1.2, 1.3, 3.2, 5.3_

  - [ ] 4.3 Implement `/auth/me` handler in `auth_me.py`
    - Validate session cookie
    - Return user info JSON (userId, email, name) if valid
    - Return 401 with cleared cookie if invalid
    - _Requirements: 2.1_

  - [ ] 4.4 Implement `/auth/logout` handler in `auth_logout.py`
    - Validate session to retrieve refresh token
    - Revoke refresh token with Auth0
    - Clear session cookie
    - Redirect to Auth0 `/v2/logout` with `returnTo` pointing to SPA login page
    - _Requirements: 2.4_

  - [ ]* 4.5 Write property test for unauthenticated access (Property 1)
    - **Property 1: Unauthenticated access returns no content and preserves requested URL**
    - Generate random URL paths (valid, nested, query params, special chars) using Hypothesis
    - Verify no group content in response body and redirect preserves requested URL
    - **Validates: Requirements 1.1, 4.2**

  - [ ]* 4.6 Write property test for post-authentication redirect (Property 2)
    - **Property 2: Post-authentication redirect targets correct destination**
    - Generate random stored URLs (null, empty, relative, with query params) using Hypothesis
    - Verify redirect goes to stored URL or default landing page
    - **Validates: Requirements 1.3**

- [ ] 5. Checkpoint - Backend auth flow tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement backend session middleware and protected routes
  - [ ] 6.1 Implement session middleware pipeline in `handler.py`
    - Implement `handle_protected_request()` with full pipeline: validate session → check timeouts → refresh token if expired → verify membership → update activity → route request
    - Return 401 with cleared cookie on any auth failure (fail closed)
    - Attach updated session cookie if tokens were refreshed
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 3.3, 5.3_

  - [ ] 6.2 Implement membership verification in `membership.py`
    - Implement `check_membership()` verifying user_id exists in Auth0 tenant
    - Return `MembershipResult` with is_member status
    - Ensure membership is checked on every protected request
    - _Requirements: 3.1, 3.2, 3.3, 3.5_

  - [ ] 6.3 Implement Lambda request router in `handler.py`
    - Route incoming API Gateway events to appropriate handlers based on path
    - Separate auth routes (public) from protected routes (require session middleware)
    - Include `/health` as a public endpoint
    - Implement centralized error handling in `errors.py` (no content leakage)
    - _Requirements: 4.1, 4.3, 4.4_

  - [ ] 6.4 Implement protected content routes in `routes.py`
    - Implement `/api/content` handler returning group content
    - Implement `/api/members` handler returning member list
    - Ensure all responses only return data when session is valid
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ]* 6.5 Write property test for valid session access (Property 3)
    - **Property 3: Valid session grants access to all protected routes**
    - Generate random protected routes × valid sessions using Hypothesis
    - Verify all valid sessions grant access without re-authentication
    - **Validates: Requirements 2.1**

  - [ ]* 6.6 Write property test for transparent token refresh (Property 4)
    - **Property 4: Server-side token refresh is transparent to client**
    - Generate sessions with expired access tokens + mock successful refresh using Hypothesis
    - Verify original request is processed without error after refresh
    - **Validates: Requirements 2.2**

  - [ ]* 6.7 Write property test for non-member denial (Property 6)
    - **Property 6: Non-member authenticated users are denied access**
    - Generate random user IDs not in a generated member list using Hypothesis
    - Verify 403 response with unauthorized indication
    - **Validates: Requirements 3.2**

  - [ ]* 6.8 Write property test for identical unauthenticated responses (Property 7)
    - **Property 7: Unauthenticated responses are identical regardless of resource existence**
    - Generate pairs of existing/non-existing URL paths using Hypothesis
    - Verify responses are structurally identical (same status, same body shape)
    - **Validates: Requirements 4.4**

  - [ ]* 6.9 Write property test for no tokens exposed (Property 8)
    - **Property 8: No tokens exposed to browser**
    - Generate sequences of auth operations, inspect all response bodies + cookies using Hypothesis
    - Verify no raw access/refresh tokens appear in any response body or non-HTTP-only cookie
    - **Validates: Requirements 5.1**

- [ ] 7. Checkpoint - Backend fully tested
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement React SPA frontend
  - [ ] 8.1 Implement SessionProvider context
    - Create `SessionProvider` component that calls `/auth/me` on mount
    - Expose `SessionState` (isAuthenticated, isLoading, user, error) via React context
    - Handle loading state while session check is in progress
    - Handle 401 response by setting isAuthenticated to false
    - _Requirements: 2.1_

  - [ ] 8.2 Implement ProtectedRoute component
    - Create `ProtectedRoute` wrapper that checks session context
    - If not authenticated, redirect browser to `/auth/login?redirect_url={currentPath}`
    - Show loading indicator while session check is in progress
    - _Requirements: 1.1, 4.2_

  - [ ] 8.3 Implement pages and navigation
    - Create `LoginPage` with a button navigating to backend `/auth/login`
    - Create `UnauthorizedPage` shown when user is authenticated but not a member (403 from `/auth/me`)
    - Create `HomePage` as the default landing page for authenticated members
    - Create `ErrorBoundary` component with retry option for service unavailability
    - Implement `LogoutButton` component navigating to backend `/auth/logout`
    - _Requirements: 1.4, 1.6, 2.4, 3.2_

  - [ ] 8.4 Wire up React Router and App component
    - Configure React Router with public routes (`/login`, `/unauthorized`) and protected routes
    - Wrap application in `SessionProvider`
    - Set up `ErrorBoundary` at the top level
    - Ensure all protected routes use `ProtectedRoute` wrapper
    - _Requirements: 1.1, 4.1_

  - [ ]* 8.5 Write unit tests for frontend components
    - Test `SessionProvider` handles 401, 200, and network errors from `/auth/me`
    - Test `ProtectedRoute` redirects to login when unauthenticated
    - Test `ProtectedRoute` renders children when authenticated
    - Test `LoginPage` navigates to correct backend URL
    - Test `LogoutButton` navigates to correct backend URL
    - _Requirements: 1.1, 2.1, 2.4_

- [ ] 9. Checkpoint - Frontend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Infrastructure and deployment setup
  - [ ] 10.1 Create S3 bucket and CloudFront distribution configuration
    - Create IaC script or deployment script for S3 bucket (private, OAI-restricted)
    - Configure CloudFront distribution with S3 origin, HTTPS redirect, custom error responses (403→index.html, 404→index.html)
    - Set default root object to `index.html`
    - Use PriceClass_100 (US, Canada, Europe)
    - _Requirements: 4.1, 5.2_

  - [ ] 10.2 Create API Gateway and Lambda deployment configuration
    - Create IaC script or deployment script for Lambda function (Python 3.12, 128MB, 10s timeout)
    - Configure API Gateway REST API with CORS (allow credentials, allow CloudFront origin)
    - Define routes: `/auth/login`, `/auth/callback`, `/auth/logout`, `/auth/me`, `/api/content`, `/api/members`, `/health`
    - Configure Lambda environment variables for Auth0 settings and session secret
    - _Requirements: 1.5, 1.6, 5.2_

  - [ ] 10.3 Create deployment scripts
    - Create frontend build and deploy script (`npm run build` → upload to S3 → CloudFront invalidation)
    - Create backend package and deploy script (zip Python code + dependencies → update Lambda)
    - Document Auth0 tenant setup steps (Regular Web Application, callback URLs, allowed origins)
    - _Requirements: 1.5_

- [ ] 11. Integration wiring and final verification
  - [ ] 11.1 Wire frontend API client to backend endpoints
    - Configure `ApiClient` base URL to point to API Gateway
    - Ensure all fetch calls include `credentials: 'include'`
    - Handle CORS preflight for cross-origin cookie sending
    - Verify session cookie flows correctly between CloudFront domain and API Gateway domain
    - _Requirements: 2.1, 5.1, 5.2_

  - [ ]* 11.2 Write integration tests for full auth flow
    - Test login → callback → session cookie set → access protected route
    - Test expired session → redirect to login
    - Test logout → cookie cleared → redirect to Auth0 logout
    - Test non-member → 403 → unauthorized page
    - _Requirements: 1.2, 1.3, 2.4, 3.2_

- [ ] 12. Final checkpoint - All tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (Hypothesis for Python backend)
- Unit tests validate specific examples and edge cases
- The frontend never communicates directly with Auth0 — all auth flows go through the backend BFF
- All tokens are stored server-side in the encrypted session cookie; the browser never sees raw tokens
- Auth0 is configured as a "Regular Web Application" (confidential client), not as a SPA

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "3.1"] },
    { "id": 2, "tasks": ["2.2", "3.2", "8.1"] },
    { "id": 3, "tasks": ["2.3", "2.4", "4.1", "4.3", "4.4", "8.2"] },
    { "id": 4, "tasks": ["4.2", "4.5", "4.6", "8.3"] },
    { "id": 5, "tasks": ["6.1", "6.2", "8.4"] },
    { "id": 6, "tasks": ["6.3", "6.4", "8.5"] },
    { "id": 7, "tasks": ["6.5", "6.6", "6.7", "6.8", "6.9"] },
    { "id": 8, "tasks": ["10.1", "10.2"] },
    { "id": 9, "tasks": ["10.3", "11.1"] },
    { "id": 10, "tasks": ["11.2"] }
  ]
}
```
