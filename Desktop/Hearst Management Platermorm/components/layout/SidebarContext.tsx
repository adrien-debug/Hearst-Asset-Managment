'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  isTablet: boolean;
  isLargeScreen: boolean;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  });
  const [isTablet, setIsTablet] = useState(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      return width > 768 && width <= 1024;
    }
    return false;
  });
  const [isLargeScreen, setIsLargeScreen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1440;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkResponsive = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      const mobile = width <= 768;
      const tablet = width > 768 && width <= 1024;
      const largeScreen = width >= 1440;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      setIsLargeScreen(largeScreen);
      
      // Fermer le menu mobile si on passe en desktop
      if (width > 768) {
        setIsMobileOpen(false);
      }
      
      // Auto-collapse sur tablet si pas déjà collapsed
      if (tablet && !isCollapsed && !mobile) {
        setIsCollapsed(true);
      }
    };
    
    checkResponsive();
    
    // Debounce pour améliorer les performances
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkResponsive, 150);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      if (typeof window !== 'undefined' && window.removeEventListener) {
        try {
          window.removeEventListener('resize', handleResize);
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, [isCollapsed]);

  useEffect(() => {
    if (typeof document === 'undefined' || !document.body) return;
    
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    if (isMobileOpen && isMobile) {
      // Calculer la largeur de la barre de défilement pour compenser
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      // Compenser la disparition de la barre de défilement pour éviter le décalage
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = originalOverflow || '';
      document.body.style.paddingRight = originalPaddingRight || '';
    }
    
    return () => {
      if (typeof document !== 'undefined' && document.body) {
        try {
          document.body.style.overflow = originalOverflow || '';
          document.body.style.paddingRight = originalPaddingRight || '';
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, [isMobileOpen, isMobile]);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        isMobile,
        isTablet,
        isLargeScreen,
        isMobileOpen,
        setIsMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

