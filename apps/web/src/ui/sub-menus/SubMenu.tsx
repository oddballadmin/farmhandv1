import React from 'react';
import { NavLink } from 'react-router-dom';

export interface SubMenuItem {
  title: string;
  url: string;
  slug: string;
}

export interface SubMenuProps {
  items: SubMenuItem[];
  className?: string;
}

export const SubMenu: React.FC<SubMenuProps> = ({ items, className = '' }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className={`sub-menu ${className}`} aria-label="Sub navigation">
      <ul className="sub-menu-list">
        {items.map((item) => (
          <li key={item.slug} className="sub-menu-item">
            <NavLink
              to={item.url}
              className={({ isActive }) => 
                isActive ? 'sub-menu-link active' : 'sub-menu-link'
              }
            >
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};