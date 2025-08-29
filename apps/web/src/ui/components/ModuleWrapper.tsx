import React from 'react';

interface ModuleWrapperProps {
  moduleName: string;
  hasSubMenu?: boolean;
  subMenuComponent?: React.ComponentType;
  children: React.ReactNode;
}

export const ModuleWrapper: React.FC<ModuleWrapperProps> = ({ 
  moduleName, 
  hasSubMenu = false, 
  subMenuComponent: SubMenuComponent,
  children 
}) => {
  return (
    <section className="module-panel" aria-labelledby={`${moduleName.toLowerCase()}-heading`}>
      {hasSubMenu && SubMenuComponent && <SubMenuComponent />}
      {children}
    </section>
  );
};