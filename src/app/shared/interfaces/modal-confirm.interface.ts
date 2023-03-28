import { Observable } from 'rxjs';

export interface ModalConfirmData {
  text: string;
  submitName: string;
  type: ModalConfirmType;
  spinner$: Observable<boolean>;
  actionSuccess$: Observable<boolean>;
  action(): () => void;
}

export enum ModalConfirmType {
  DELETE = 'delete',
  SUCCESS = 'success'
}
