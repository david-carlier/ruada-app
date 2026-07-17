<div *ngIf="isAuthenticated; else noAuth">

  <br />

  Is Authenticated: {{ isAuthenticated }}

  <br />
  userData
  <pre>{{ userData$ | async | json }}</pre>

  <br />
</div>