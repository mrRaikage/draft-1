import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserModel } from '../../interfaces/user-data.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent {

  get userData(): UserModel {
    return this.lSService.getUserData();
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    public lSService: LocalStorageService
  ) {}

  logout(): void {
    this.authService.logout();
  }

  settings(): void {
    this.router.navigate(['/content/settings']).then();
  }
}
