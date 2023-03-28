import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ClientsActionsService } from '../../core/services/state/clients/clients-actions.service';
import * as clientsSelectors from '../../core/store/clients/clients.selectors';
import { IClientsState } from '../../core/store/clients/clients.reducer';
import { ClientModel } from '../../core/interfaces/clients.interface';
import { emptyContentClients } from '../../core/constants/empty-content.constant';
import { EmptyContentModel } from '../../core/interfaces/empty-content.interface';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  clientsLoading$: Observable<boolean> = this.clientsStore.select(clientsSelectors.selectIsDataLoading);
  clients$: Observable<ClientModel[]> = this.clientsStore.select(clientsSelectors.selectClients);
  emptyContentClients: EmptyContentModel = emptyContentClients;

  constructor(
    private clientsActionsService: ClientsActionsService,
    private clientsStore: Store<IClientsState>,
) { }

  ngOnInit(): void {
  }

  addClientButtonClick(): void {
    this.clientsActionsService.addClient();
  }
}
