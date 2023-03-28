import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../../auth/services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private authService: AuthService, private lSService: LocalStorageService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkLogin();
  }

  checkLogin(): boolean {
    if (this.lSService.getRefreshToken()) {
      return true;
    }
    this.router.navigate(['auth/sign-in']).then(_ => false);
  }
}
