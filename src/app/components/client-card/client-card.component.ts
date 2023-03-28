import { Component, Input, OnInit } from '@angular/core';

import { ClientsActionsService } from '../../core/services/state/clients/clients-actions.service';
import { ClientModel } from '../../core/interfaces/clients.interface';

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.scss']
})
export class ClientCardComponent implements OnInit {

  @Input() clientModel: ClientModel;

  constructor(private clientActionsService: ClientsActionsService) {
  }

  ngOnInit(): void {
  }

  viewClientButtonClick(): void {
    this.clientActionsService.viewClient(this.clientModel);
  }
}
