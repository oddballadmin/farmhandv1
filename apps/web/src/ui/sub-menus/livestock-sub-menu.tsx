import React from 'react';
import { SubMenu, SubMenuItem } from './SubMenu';

export const LivestockSubMenu: React.FC = () => {
  const menuItems: SubMenuItem[] = [
    {
      title: 'Overview',
      url: '/livestock',
      slug: 'overview'
    },
    {
      title: 'Herds',
      url: '/livestock/herds',
      slug: 'herds'
    },
    {
      title: 'Animals',
      url: '/livestock/animals',
      slug: 'animals'
    },
    {
      title: 'Health',
      url: '/livestock/health',
      slug: 'health'
    },
    {
      title: 'Feed',
      url: '/livestock/feed',
      slug: 'feed'
    }
  ];

  return <SubMenu items={menuItems} />;
};