import { GenericSubMenu, SubMenuItem } from './GenericSubMenu';

const items: SubMenuItem[] = [
  { title: 'Overview', url: '/livestock', slug: 'overview' },
  { title: 'Herds', url: '/livestock/herds', slug: 'herds' },
  { title: 'Animals', url: '/livestock/animals', slug: 'animals' },
  { title: 'Health', url: '/livestock/health', slug: 'health' },
  { title: 'Feeding', url: '/livestock/feeding', slug: 'feeding' },
];

export const LivestockSubMenu = () => {
  return <GenericSubMenu items={items} />;
};

export default LivestockSubMenu;
