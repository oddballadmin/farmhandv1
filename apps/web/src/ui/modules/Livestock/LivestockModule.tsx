import React from 'react';
import { LivestockSubMenu } from '../sub-menus/Livestock-sub-menu';

type LivestockModuleProps = {
  hasSubMenu?: boolean;
};

export const LivestockModule: React.FC<LivestockModuleProps> = ({ hasSubMenu = true }) => {
  return (
    <section className="module-panel" aria-labelledby="livestock-heading">
      <h2 id="livestock-heading">Livestock</h2>
      {hasSubMenu ? <LivestockSubMenu /> : null}
      <p>This is the Livestock module. We’ll show herds, animals, and health data here.</p>
      {/* TODO: Replace with real data and sub-routes (list, detail, health, feed) */}
    </section>
  );
};
