import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ModalMode } from '../../core/constants/transaction.constants';

@Injectable({
  providedIn: 'root'
})
export class ModalModeService {

  private modalModeSubject: BehaviorSubject<ModalMode> = new BehaviorSubject<ModalMode>(null);
  public modalMode$: Observable<ModalMode> = this.modalModeSubject.asObservable();

  constructor() { }

  public setModalMode(modalMode: ModalMode): void {
    this.modalModeSubject.next(modalMode);
  }

  public getModalMode(): ModalMode {
    return this.modalModeSubject.value;
  }
}
