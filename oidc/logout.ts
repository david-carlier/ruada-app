<button (click)="logout()">Logout</button>

logout(): void {
  // Clear session storage
  if (window.sessionStorage) {
    window.sessionStorage.clear();
  }

  window.location.href = "https://<user pool domain>/logout?client_id=4lhit4sfgffdkvbdd5opa00d4f&logout_uri=<logout uri>";
}