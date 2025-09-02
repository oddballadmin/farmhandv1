import { NavLink } from 'react-router-dom';

export type SubMenuItem = {
  title: string;
  url: string;
  slug: string;
};

export interface GenericSubMenuProps {
  items: SubMenuItem[];
  className?: string;
}

/**
 * Generic, accessible sub-menu used by individual module sub-menus.
 * Each module can compose this with its own set of items.
 */
export const GenericSubMenu = ({ items, className }: GenericSubMenuProps) => {
  return (
    <nav className={`sub-menu ${className ?? ''}`} aria-label="Module sub-navigation">
      <ul className="sub-menu__list">
        {items.map((item) => (
          <li key={item.slug} className="sub-menu__item">
            <NavLink
              to={item.url}
              className={({ isActive }) => `sub-menu__link ${isActive ? 'active' : ''}`}
              end
            >
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default GenericSubMenu;
