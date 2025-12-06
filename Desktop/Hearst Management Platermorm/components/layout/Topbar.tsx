'use client';

import React, { useState, useEffect } from 'react';
import { useSidebar } from './SidebarContext';

export default function Topbar() {
  const [mounted, setMounted] = useState(false);
  const { isCollapsed, isMobile, isTablet, isLargeScreen } = useSidebar();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Calculer la position left du topbar selon l'état de la sidebar
  // Utiliser une valeur par défaut qui correspond au rendu serveur (220px) jusqu'à ce que le composant soit monté
  const getTopbarLeft = () => {
    if (!mounted) {
      // Valeur par défaut correspondant au rendu serveur
      return '220px';
    }
    if (isMobile) return 0;
    if (isCollapsed) {
      if (isTablet) return '70px';
      return '80px';
    }
    if (isTablet) return '200px';
    if (isLargeScreen) return '240px';
    return '220px';
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      right: 0,
      left: getTopbarLeft(),
      backgroundColor: 'var(--color-bg)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      zIndex: 40,
      height: isMobile ? '66px' : '74px',
      transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }} className={isMobile ? 'mobile-topbar' : ''}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '8px' : '16px',
        padding: isMobile ? '12px 16px' : '16px 24px',
        height: '100%'
      }}>
        {/* Asset Management */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            color: 'white',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            fontWeight: 400,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: 0.9
          }}>
            Asset Management
          </div>
        </div>

        {/* User Avatar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: isMobile ? '36px' : '40px',
            height: isMobile ? '36px' : '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: isMobile ? '0.875rem' : '1rem',
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '0.02em'
          }}>
            JD
          </div>
        </div>
      </div>
    </header>
  );
}

