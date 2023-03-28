import { Observable } from 'rxjs';

import { AccountModel } from './account.interface';

export interface ModalAccountInterface {
  label: string;
  account: AccountModel;
  submitButtonName: string;
  spinner$: Observable<boolean>;
  actionSuccess$: Observable<boolean>;
  action(data: AccountModel): () => void;
}
