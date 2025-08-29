import React from 'react';
import { SubMenu, SubMenuItem } from './SubMenu';

export const FarmsSubMenu: React.FC = () => {
  const menuItems: SubMenuItem[] = [
    {
      title: 'Overview',
      url: '/farms',
      slug: 'overview'
    },
    {
      title: 'Properties',
      url: '/farms/properties',
      slug: 'properties'
    },
    {
      title: 'Management',
      url: '/farms/management',
      slug: 'management'
    },
    {
      title: 'Reports',
      url: '/farms/reports',
      slug: 'reports'
    }
  ];

  return <SubMenu items={menuItems} />;
};