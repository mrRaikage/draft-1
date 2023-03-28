import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { filter, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { ModalMode } from '../../core/constants/transaction.constants';
import { ModalClientsComponent } from '../modal-clients/modal-clients.component';
import { ModalClientsService } from '../../core/services/state/clients/modal-clients.service';
import { ClientsActionsService } from '../../core/services/state/clients/clients-actions.service';
import { ModalModeService } from '../../shared/services/modal-mode.service';
import { IClientsState } from '../../core/store/clients/clients.reducer';
import * as clientsActions from '../../core/store/clients/clients.actions';
import * as clientsSelectors from '../../core/store/clients/clients.selectors';
import { ClientModel } from '../../core/interfaces/clients.interface';

@Component({
  selector: 'app-clients-tab',
  templateUrl: './clients-tab.component.html',
  styleUrls: ['./clients-tab.component.scss']
})
export class ClientsTabComponent implements OnInit, OnDestroy {

  form: FormGroup;

  currentClient: ClientModel;

  subscription$ = new Subject();
  spinnerStarted$: Observable<boolean> = this.clientsStore.select(clientsSelectors.selectSpinner);

  get modalMode(): ModalMode {
    return this. modalModeService.getModalMode();
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalClientsComponent>,
    private modalClientsService: ModalClientsService,
    private clientsStore: Store<IClientsState>,
    private clientsActionsService: ClientsActionsService,
    private dialog: MatDialog,
    private modalModeService: ModalModeService,
    private clientActionService: ClientsActionsService
  ) {

    /** Get Current Client */
    this.modalClientsService.currentClient$
      .pipe(takeUntil(this.subscription$))
      .subscribe((currentClient: ClientModel) => {
        this.currentClient = currentClient;
        this.fillFormGroup(this.currentClient);
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  saveButtonClick(): void {
    if (this.form.invalid) {
      return;
    }

    if (this.modalMode === 'Add') {
      this.clientsStore.dispatch(clientsActions.addClient({ addClient: this.form.getRawValue() }));
    }

    if (this.modalMode === 'Edit') {
      const form = this.form.value;
      const editClient: ClientModel = {
        address: form.address,
        id: this.currentClient.id,
        name: form.name,
        phone: form.phone,
        email: form.email
      };
      this.clientsStore.dispatch(clientsActions.editClient({ editClient }));
    }

    this.clientsStore.select(clientsSelectors.selectIsLoadAfterAction).pipe(
      takeUntil(this.subscription$),
      filter( res => Boolean(res)),
      withLatestFrom(this.clientsStore.select(clientsSelectors.selectClient))
    )
      .subscribe(([, currentClient]: [boolean, ClientModel]) => {
        this.modalModeService.setModalMode(ModalMode.View);
        this.modalClientsService.setCurrentClient(currentClient);
      });
  }

  editButtonClick(): void {
    this.modalModeService.setModalMode(ModalMode.Edit);
  }

  cancelButtonClick(): void {
    this.modalMode === 'Edit'
      ? ( this.modalModeService.setModalMode(ModalMode.View),
          this.fillFormGroup(this.currentClient))
      : this.dialogRef.close();
  }

  fillFormGroup(currentClient: ClientModel ): void {
    this.form = this.fb.group({
      name: new FormControl(currentClient.name, [Validators.required]),
      email: new FormControl(currentClient.email),
      address: new FormControl(currentClient.address),
      phone: new FormControl(currentClient.phone),
    });
  }

  deleteButtonClick(): void {
    this.clientActionService.deleteClient(this.currentClient.id, this.dialogRef);
  }
}
