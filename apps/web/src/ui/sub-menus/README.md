# Sub-Menus

This directory contains toggleable sub-menu components for module navigation.

## Overview

The sub-menu system provides optional navigation menus that can be displayed at the top of individual modules. Each module can have its own customized sub-menu with navigation items relevant to that module's functionality.

## Components

### SubMenu (Generic Component)
The base component that all module-specific sub-menus are built upon.

**Props:**
- `items`: Array of `SubMenuItem` objects
- `className`: Optional CSS class name

**SubMenuItem Interface:**
```typescript
interface SubMenuItem {
  title: string;  // Display text for the menu item
  url: string;    // Navigation URL
  slug: string;   // Unique identifier for the item
}
```

### Module-Specific Sub-Menus

Each module has its own sub-menu file following the naming convention:
- `{module-name}-sub-menu.tsx`

**Current implementations:**
- `livestock-sub-menu.tsx` - Sub-menu for the Livestock module
- `farms-sub-menu.tsx` - Sub-menu for the Farms module

## Usage

### Option 1: Using ModuleWrapper (Recommended)

```typescript
import { ModuleWrapper } from '../components/ModuleWrapper';
import { FarmsSubMenu } from '../sub-menus';

const MyModule = () => (
  <ModuleWrapper 
    moduleName="MyModule" 
    hasSubMenu={true} 
    subMenuComponent={MyModuleSubMenu}
  >
    <h2>My Module Content</h2>
    <p>Module content goes here...</p>
  </ModuleWrapper>
);
```

### Option 2: Direct Component Integration

```typescript
import { MyModuleSubMenu } from '../sub-menus';

interface MyModuleProps {
  hasSubMenu?: boolean;
}

const MyModule: React.FC<MyModuleProps> = ({ hasSubMenu = true }) => (
  <section className="module-panel">
    {hasSubMenu && <MyModuleSubMenu />}
    <h2>My Module Content</h2>
    <p>Module content goes here...</p>
  </section>
);
```

## Creating a New Sub-Menu

1. Create a new file: `{module-name}-sub-menu.tsx`
2. Define your menu items:

```typescript
import React from 'react';
import { SubMenu, SubMenuItem } from './SubMenu';

export const MyModuleSubMenu: React.FC = () => {
  const menuItems: SubMenuItem[] = [
    {
      title: 'Overview',
      url: '/mymodule',
      slug: 'overview'
    },
    {
      title: 'Settings',
      url: '/mymodule/settings',
      slug: 'settings'
    }
  ];

  return <SubMenu items={menuItems} />;
};
```

3. Export it from `index.ts`:

```typescript
export { MyModuleSubMenu } from './mymodule-sub-menu';
```

## Styling

Sub-menus are styled using CSS classes defined in `layout.css`:
- `.sub-menu` - Container for the sub-menu
- `.sub-menu-list` - List wrapper
- `.sub-menu-item` - Individual list items
- `.sub-menu-link` - Navigation links
- `.sub-menu-link.active` - Active/current link

## Toggle Functionality

The `hasSubMenu` prop allows you to:
- Enable sub-menus where needed: `hasSubMenu={true}`
- Disable sub-menus: `hasSubMenu={false}`
- Use default behavior: `hasSubMenu` (defaults to true for modules that support it)

This provides flexibility to show or hide sub-menus based on user preferences, feature flags, or other application logic.