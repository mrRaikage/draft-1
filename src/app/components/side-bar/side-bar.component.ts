import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

import { IListItem } from '../../shared/interfaces/side-bar.interface';
import { sideBarMenuList } from '../../shared/constants/side-bar.constants';
import { AuthService } from '../../auth/services/auth.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {

  @Input() isOpened: boolean;

  menuList: IListItem[];
  isFinancialReports: boolean;

  @HostListener('window:click', ['$event.target'])
  closeFinancialReports(el): void {
    if (
      (!this.eref.nativeElement.contains(el) && !this.isOpened) ||
      (el.id === 'sidebar-trigger')
    ) {
      this.isFinancialReports = false;
    }
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private eref: ElementRef,
    private lsService: LocalStorageService
  ) {
    this.router.events
      .pipe(filter((res: RouterEvent) => Boolean(res.url)))
      .subscribe((res: RouterEvent) => {
        this.isFinancialReports = res.url.includes('financial-reports');
      });

    this.hideBankFeedsItem();
  }

  hideBankFeedsItem(): void {
    const bankFeeds = this.lsService.getFeatureFlags()?.BankFeeds;

    bankFeeds
      ? this.menuList = sideBarMenuList
      : this.menuList = sideBarMenuList.filter(item => item.name !== 'Bank Feeds');
  }

  logout(): void {
    this.authService.logout();
  }
}
