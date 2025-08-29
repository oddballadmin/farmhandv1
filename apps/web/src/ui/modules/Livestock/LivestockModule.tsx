import React from 'react';
import { LivestockSubMenu } from '../../sub-menus';

interface LivestockModuleProps {
  hasSubMenu?: boolean;
}

export const LivestockModule: React.FC<LivestockModuleProps> = ({ hasSubMenu = true }) => {
  return (
    <section className="module-panel" aria-labelledby="livestock-heading">
      {hasSubMenu && <LivestockSubMenu />}
      <h2 id="livestock-heading">Livestock</h2>
      <p>This is the Livestock module. We'll show herds, animals, and health data here.</p>
      {/* TODO: Replace with real data and sub-routes (list, detail, health, feed) */}
    </section>
  );
};
