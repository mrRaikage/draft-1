export interface ISelectListItem<T> {
  displayName: string;
  value: T;
}

export interface ISelectListGroup<T> {
  displayName: string;
  children: T;
}
