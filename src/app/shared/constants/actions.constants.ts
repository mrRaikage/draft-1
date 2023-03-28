import { Action, ActionKey, ActionName } from '../interfaces/actions.interface';

export const actionsList: Action[] = [
  {
    key: ActionKey.Edit,
    name: ActionName.Edit,
    icon: 'pencil',
  },
  {
    key: ActionKey.Delete,
    name: ActionName.Delete,
    icon: 'delete',
  },
  {
    key: ActionKey.View,
    name: ActionName.View,
    icon: 'dollar-blank'
  }
];
