import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { filter, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { ModalClientsService } from './/modal-clients.service';
import { ModalMode } from '../../../constants/transaction.constants';
import { ModalClientsComponent } from '../../../../components/modal-clients/modal-clients.component';
import { ModalModeService } from '../../../../shared/services/modal-mode.service';
import { ClientModel } from '../../../interfaces/clients.interface';
import { ModalConfirmComponent } from '../../../../shared/components/modal-confirm/modal-confirm.component';
import { ModalConfirmData, ModalConfirmType } from '../../../../shared/interfaces/modal-confirm.interface';
import * as clientsSelectors from '../../../store/clients/clients.selectors';
import * as clientsActions from '../../../store/clients/clients.actions';
import { IClientsState } from '../../../store/clients/clients.reducer';

@Injectable({
  providedIn: 'root'
})
export class ClientsActionsService {

  constructor(
    private dialog: MatDialog,
    private modalClientsService: ModalClientsService,
    private modalModeService: ModalModeService,
    private clientsStore: Store<IClientsState>
  ) { }

  addClient(): void {
    const emptyClientModel: ClientModel = {
      address: null,
      id: null,
      name: null,
      phone: null,
      email: null
    };
    this.modalModeService.setModalMode(ModalMode.Add);
    this.modalClientsService.setCurrentClient(emptyClientModel);
    this.openModal();
  }

  viewClient(organizationClientModel: ClientModel) {
    this.modalClientsService.setCurrentClient(organizationClientModel);
    this.modalModeService.setModalMode(ModalMode.View);
    this.openModal();
  }

  deleteClient(clientId: string, dialogRef: MatDialogRef<ModalClientsComponent>): void {
    this.dialog.open(ModalConfirmComponent, {
      height: '300px',
      width: '440px',
      autoFocus: false,
      data: {
        text: `Are you sure you want to delete this client?`,
        submitName: 'Delete',
        type: ModalConfirmType.DELETE,
        spinner$: this.clientsStore.select(clientsSelectors.selectSecondarySpinner),
        actionSuccess$: this.clientsStore.select(clientsSelectors.selectIsLoadAfterAction),
        action: () => this.clientsStore.dispatch(clientsActions.deleteClient({ clientId })),
      } as ModalConfirmData
    })
      .afterClosed()
      .pipe(take(1), filter(res => Boolean(res)))
      .subscribe(() => dialogRef.close());
  }

  openModal(): void {
    this.dialog.open(ModalClientsComponent, {
      width: '980px',
      height: 'auto',
      position: { top: '80px' },
    });
  }
}
