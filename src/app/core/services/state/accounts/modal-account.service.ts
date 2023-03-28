import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AccountModel } from '../../../interfaces/account.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalAccountService {

  private currentAccountSubject: BehaviorSubject<AccountModel> = new BehaviorSubject<AccountModel>(null);
  public currentAccount$: Observable<AccountModel> = this.currentAccountSubject.asObservable();

  constructor() { }

  public setCurrentAccount(account: AccountModel): void {
    this.currentAccountSubject.next(account);
  }

  public getCurrentAccount(): AccountModel {
    return this.currentAccountSubject.value;
  }
}
