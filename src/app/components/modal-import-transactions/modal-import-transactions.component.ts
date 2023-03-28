import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ITransactionsState } from '../../core/store/transactions/transactions.reducer';
import * as transactionsActions from '../../core/store/transactions/transactions.actions';
import * as transactionsSelectors from '../../core/store/transactions/transactions.selectors';

@Component({
  selector: 'app-modal-import-transactions',
  templateUrl: './modal-import-transactions.component.html',
  styleUrls: ['./modal-import-transactions.component.scss']
})
export class ModalImportTransactionsComponent implements OnInit {

  importSpinner$: Observable<boolean> = this.transactionStore.select(transactionsSelectors.selectImportTransactionSpinner);

  constructor(
    public dialogRef: MatDialogRef<ModalImportTransactionsComponent>,
    private transactionStore: Store<ITransactionsState>
  ) {
    dialogRef.disableClose = true;

  }

  ngOnInit(): void {
  }

  handleFileInput(file): void {
    const uploadedFile = new FormData();
    uploadedFile.append('file', new Blob([file], { type: 'text/csv' }), file.name);
    this.transactionStore.dispatch(transactionsActions.importTransactions({ file: uploadedFile }));
  }

}
