'use client';

import { createContext, useContext, useState } from 'react';

type DashboardContextType = {
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <DashboardContext.Provider value={{ isMobileOpen, setIsMobileOpen }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}