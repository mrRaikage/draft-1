import { createSelector } from '@ngrx/store';

export const selectInvoicesState = (state) => state.invoices;

export const selectInvoices = createSelector(
  selectInvoicesState,
  (state) => state.list
);

export const selectIsDataLoaded = createSelector(
  selectInvoicesState,
  (state) => state.dataLoaded
);

export const selectIsSpinnerStarted = createSelector(
  selectInvoicesState,
  (state) => state.spinnerStarted
);

export const selectIsDeleteInvoiceSpinnerStarted = createSelector(
  selectInvoicesState,
  state => state.deleteInvoiceSpinnerStarted
);

export const selectInvoiceNumberLoading = createSelector(
  selectInvoicesState,
  (state) => state.invoiceNumberLoading
);

export const selectInvoiceNumber = createSelector(
  selectInvoicesState,
  (state) => state.invoiceNumber
);

export const selectIsDataLoadedAfterAction = createSelector(
  selectInvoicesState,
  (state) => state.dataLoadedAfterAction
);

export const selectCurrentInvoice = createSelector(
  selectInvoicesState,
  (state) => state.currentInvoice
);

export const selectPdfGenerationStatus = createSelector(
  selectInvoicesState,
  (state) => state.pdfGenerationStatus
);

export const selectIsPdfLoading = createSelector(
  selectInvoicesState,
  (state) => state.isPdfLoading
);

export const selectInvoiceLedgerItemsList = createSelector(
  selectInvoicesState,
  state => state.ledgerItemsList
);

export const selectIsLedgerItemsLoading = createSelector(
  selectInvoicesState,
  state => state.ledgerItemsLoading
);

export const selectDownloadedInvoicePdf = createSelector(
  selectInvoicesState,
  state => state.downloadedInvoicePdf
);


