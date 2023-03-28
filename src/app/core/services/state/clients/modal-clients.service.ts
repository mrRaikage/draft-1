import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ClientModel } from '../../../interfaces/clients.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalClientsService {

  private currentClientSubject: BehaviorSubject<ClientModel> = new BehaviorSubject<ClientModel>(null);
  public currentClient$: Observable<ClientModel> = this.currentClientSubject.asObservable();

  constructor() {}

  public getCurrentClient(): ClientModel {
    return this.currentClientSubject.value;
  }

  public setCurrentClient(currentClient: ClientModel): void {
    this.currentClientSubject.next(currentClient);
  }

}
