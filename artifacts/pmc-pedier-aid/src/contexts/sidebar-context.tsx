import { createContext, useContext, useState, type ReactNode } from 'react';

interface SidebarCtx {
  desktopOpen: boolean;
  mobileOpen: boolean;
  toggleDesktop: () => void;
  openMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarCtx>({
  desktopOpen: true,
  mobileOpen: false,
  toggleDesktop: () => {},
  openMobile: () => {},
  closeMobile: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        desktopOpen,
        mobileOpen,
        toggleDesktop: () => setDesktopOpen((v) => !v),
        openMobile: () => setMobileOpen(true),
        closeMobile: () => setMobileOpen(false),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
