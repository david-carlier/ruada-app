/**
 * UnauthorizedPage — Shown when the user is authenticated
 * but not a member of the music group (403 from /auth/me).
 *
 * Placeholder: full implementation in task 8.3
 */
export function UnauthorizedPage() {
  return (
    <div>
      <h1>Unauthorized</h1>
      <p>You are not a member of this group.</p>
    </div>
  );
}
