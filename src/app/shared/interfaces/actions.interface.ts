export interface Action {
  key: ActionKey;
  name: ActionName;
  icon: string;
}

export enum ActionKey {
  Edit = 'edit',
  Delete = 'delete',
  View = 'view',
  Create = 'create',
  ExportToScv = 'exportToCsv'
}

export enum ActionName {
  Edit = 'Edit',
  Delete = 'Delete',
  View = 'View'
}

