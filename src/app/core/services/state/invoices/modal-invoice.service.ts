import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InvoiceType } from '../../../constants/transaction.constants';

import { InvoiceModel } from '../../../interfaces/invoice.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalInvoiceService {

  private currentInvoiceSubject: BehaviorSubject<InvoiceModel> = new BehaviorSubject<InvoiceModel>(null);
  public currentInvoice$: Observable<InvoiceModel> = this.currentInvoiceSubject.asObservable();

  public invoiceType$: BehaviorSubject<InvoiceType> = new BehaviorSubject<InvoiceType>(null);

  constructor() { }

  setCurrentInvoice(invoice: InvoiceModel): void {
    this.currentInvoiceSubject.next(invoice);
  }

  getCurrentInvoice(): InvoiceModel {
    return this.currentInvoiceSubject.value;
  }

  setInvoiceType(transactionType: InvoiceType): void {
    this.invoiceType$.next(transactionType);
  }

  getInvoiceType(): InvoiceType {
    return this.invoiceType$.value;
  }
}
