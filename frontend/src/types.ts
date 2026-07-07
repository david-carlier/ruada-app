/**
 * Session state managed by the SessionProvider context.
 * No tokens are stored here — only user info from /auth/me.
 */
export interface SessionState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserInfo | null;
  error: string | null;
}

/**
 * User information returned by the backend /auth/me endpoint.
 */
export interface UserInfo {
  userId: string;
  email: string;
  name: string;
  picture?: string;
}
