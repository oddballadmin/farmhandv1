import React from 'react';
import { NavLink, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LivestockModule } from '../modules/Livestock/LivestockModule';
import { useUIStore } from '../state/uiStore';
import './layout.css';

export const DashboardLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar, activeModule, setActiveModule } = useUIStore();
  const location = useLocation();

  const moduleDefinitions: Array<{ name: string; path: string }> = [
    { name: 'Overview', path: '/' },
    { name: 'Farms', path: '/farms' },
    { name: 'Fields', path: '/fields' },
    { name: 'Tasks', path: '/tasks' },
    { name: 'Sensors', path: '/sensors' },
  { name: 'Livestock', path: '/livestock' },
  ];

  // Keep store in sync with current route, to avoid prop drilling elsewhere
  React.useEffect(() => {
    const pathToModuleName = (pathname: string): string => {
      if (pathname === '/' || pathname === '') return 'Overview';
      const matched = moduleDefinitions.find((def) => pathname.startsWith(def.path) && def.path !== '/');
      return matched?.name ?? 'Overview';
    };
    const currentModuleName = pathToModuleName(location.pathname);
    if (currentModuleName !== activeModule) setActiveModule(currentModuleName);
  }, [location.pathname, activeModule, setActiveModule]);

  // Keyboard shortcut: Ctrl/Cmd + B to toggle sidebar
  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;
      if (isCtrlOrCmd && (event.key === 'b' || event.key === 'B')) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleSidebar]);

  return (
  <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <header className="app-header">
        <button
          className="menu-btn"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
          aria-controls="primary-sidebar"
          aria-expanded={sidebarOpen}
          title={sidebarOpen ? 'Close navigation' : 'Open navigation'}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
        <h1 className="logo">Farm Dashboard</h1>
        <div className="header-actions">
          <button className="action-btn" onClick={() => alert('Profile coming soon')}>Profile</button>
        </div>
      </header>
      <aside id="primary-sidebar" className="app-sidebar" aria-label="Main navigation">
        <nav>
          <ul>
            {moduleDefinitions.map((moduleDefinition) => (
              <li key={moduleDefinition.name}>
                <NavLink
                  to={moduleDefinition.path}
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  end
                >
                  {moduleDefinition.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="app-main" role="main">
        <Routes>
          <Route path="/" element={<ModuleContainer moduleName="Overview" />} />
          <Route path="/farms" element={<ModuleContainer moduleName="Farms" />} />
          <Route path="/fields" element={<ModuleContainer moduleName="Fields" />} />
          <Route path="/tasks" element={<ModuleContainer moduleName="Tasks" />} />
          <Route path="/sensors" element={<ModuleContainer moduleName="Sensors" />} />
          <Route path="/livestock" element={<LivestockModule />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const ModuleContainer: React.FC<{ moduleName: string }> = ({ moduleName }) => {
  switch (moduleName) {
    case 'Overview':
      return <div className="module-panel">Welcome - select a module to begin.</div>;
    case 'Farms':
      return <div className="module-panel">Farms module coming soon.</div>;
    case 'Fields':
      return <div className="module-panel">Fields module coming soon.</div>;
    case 'Tasks':
      return <div className="module-panel">Tasks module coming soon.</div>;
    case 'Sensors':
      return <div className="module-panel">Sensors module coming soon.</div>;
    default:
      return <div className="module-panel">Unknown module.</div>;
  }
};
