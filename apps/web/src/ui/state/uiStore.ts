import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  activeModule: string;
  toggleSidebar(): void;
  setActiveModule(module: string): void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      activeModule: 'Overview',
      toggleSidebar: () => set((currentState) => ({ sidebarOpen: !currentState.sidebarOpen })),
      setActiveModule: (moduleName: string) => set(() => ({ activeModule: moduleName })),
    }),
    { name: 'ui-preferences', partialize: (state) => ({ sidebarOpen: state.sidebarOpen }) }
  )
);
