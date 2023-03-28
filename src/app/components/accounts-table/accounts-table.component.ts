import { Component, Input, OnInit } from '@angular/core';

import { Action, ActionKey } from '../../shared/interfaces/actions.interface';
import { AccountModel } from '../../core/interfaces/account.interface';
import { AccountActionsService } from '../../core/services/state/accounts/account-actions.service';

@Component({
  selector: 'app-accounts-table',
  templateUrl: './accounts-table.component.html',
  styleUrls: ['./accounts-table.component.scss']
})
export class AccountsTableComponent implements OnInit {

  @Input() data: AccountModel[];
  @Input() columnsData: { [key: string]: string };
  @Input() actions: Action[];

  columns: string[];

  constructor(private accountActionService: AccountActionsService) {
  }

  ngOnInit(): void {
    this.columns = Object.keys(this.columnsData);
  }

  getColumnName(column: string): string {
    return this.columnsData[column];
  }

  handleAction(actionKey: ActionKey, element: AccountModel): void {
    switch (actionKey) {
      case ActionKey.Delete:
        this.accountActionService.deleteAccount(element.id);
        break;
      case ActionKey.Edit:
        this.accountActionService.editAccount(element);
        break;
      case ActionKey.View:
        this.accountActionService.viewAccount(element);
        break;
      default:
        return;
    }
  }

  rowClick(element): void {
    this.handleAction(ActionKey.View, element);
  }
}
