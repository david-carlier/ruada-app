<ng-template #noAuth>
  <button (click)="login()">Login</button>
  <hr />
</ng-template>

  login(): void {
    this.oidcSecurityService.authorize();
  }