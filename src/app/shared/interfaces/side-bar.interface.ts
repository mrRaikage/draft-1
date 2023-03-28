export interface IListItem {
  name: string;
  route: string;
  icon: string;
  expansion?: boolean;
  children?: IListItem[];
}
