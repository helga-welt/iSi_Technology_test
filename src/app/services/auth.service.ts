import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn: boolean;

  private router = inject(Router);

  constructor() {
    this.isLoggedIn = true;
  }

  setUserLoggedIn(value: boolean): void {
    this.isLoggedIn = value;

    if (!this.isLoggedIn) {
      this.router.navigate([`forbidden`]);
    }
  }
}
