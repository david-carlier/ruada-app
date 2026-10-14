<button (click)="logout()">Logout</button>

logout(): void {
  // Clear session storage
  if (window.sessionStorage) {
    window.sessionStorage.clear();
  }

  window.location.href = "https://<user pool domain>/logout?client_id=24f87befl8vkcjmf4sp4fuhfh0&logout_uri=<logout uri>";
}