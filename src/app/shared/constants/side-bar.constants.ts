import { IListItem } from '../interfaces/side-bar.interface';

export const sideBarMenuList: IListItem[] = [
  {
    name: 'Dashboard',
    route: 'dashboard',
    icon: 'graph',
  },
  {
    name: 'Transactions',
    route: 'transactions',
    icon: 'wallet',
  },
  {
    name: 'Invoices',
    route: 'invoices',
    icon: 'invoice',
  },
  {
    name: 'Bank Feeds',
    route: 'bank-feeds',
    icon: 'savings',
  },
  {
    name: 'Jobs',
    route: 'jobs',
    icon: 'jobs',
  },
  {
    name: 'Clients',
    route: 'clients',
    icon: 'clients',
  },
  {
    name: 'Asset Register',
    route: 'asset',
    icon: 'laptop',
  },
  {
    name: 'Financial Reports',
    route: 'financial-reports',
    icon: 'file',
    expansion: true,
    children: [
      {
        name: 'Profit and Loss Statement',
        route: 'financial-reports/profit-and-loss-report',
        icon: null
      },
      {
        name: 'Balance Sheet',
        route: 'financial-reports/balance-report',
        icon: null
      }
    ]
  },
  {
    name: 'Ledger',
    route: 'ledgers',
    icon: null,
  },
];
