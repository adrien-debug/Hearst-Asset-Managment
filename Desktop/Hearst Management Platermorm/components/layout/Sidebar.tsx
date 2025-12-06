'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';
import { getMenuIcon } from './MenuIcons';
import styles from './Sidebar.module.css';

const menuItems = [
  { label: 'Overview', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Portfolio', path: '/mandates' },
  { label: 'Execution', path: '/execution' },
  { label: 'Compliance', path: '/risk' },
  { label: 'Reports', path: '/reports' },
  { label: 'Admin', path: '/admin' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed, isMobile, isMobileOpen, setIsMobileOpen } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sidebarClasses = [
    styles.sidebar,
    isCollapsed && !isMobile ? styles.sidebarCollapsed : '',
    isMobile && !isMobileOpen ? styles.sidebarHidden : '',
    isMobile && isMobileOpen ? styles.sidebarOpen : ''
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Bouton toggle fixe pour mobile - rendu seulement après montage pour éviter l'erreur d'hydratation */}
      {mounted && isMobile && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={styles.mobileToggleButton}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? '✕' : '☰'}
        </button>
      )}
      {mounted && isMobile && (
        <div
          className={`${styles.backdrop} ${isMobileOpen ? styles.backdropVisible : ''}`}
          onClick={(e) => {
            // Ne pas fermer si on clique sur le bouton toggle
            if ((e.target as HTMLElement).closest(`.${styles.mobileToggleButton}`)) {
              return;
            }
            setIsMobileOpen(false);
          }}
          aria-hidden={!isMobileOpen}
        />
      )}
      <aside className={sidebarClasses}>
        <div className={styles.sidebarContent}>
          {/* Logo */}
          <div className={styles.logo}>
            {isCollapsed && !isMobile ? (
              <img
                src="/HEARST_LOGO%20(2).png"
                alt="Logo"
                width={32}
                height={32}
                className={styles.logoImageCollapsed}
                style={{ display: 'block' }}
              />
            ) : (
              <div className={styles.logoWrapper}>
                <img
                  src="/HEARST_LOGO.png"
                  alt="Hearst Logo"
                  className={styles.logoHGreen}
                  style={{ display: 'block' }}
                />
              </div>
            )}
          </div>

          {/* Menu section - Toggle button and Navigation centered */}
          <div className={styles.menuSection}>
            {/* Toggle button - Desktop only */}
            {!isMobile && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={styles.toggleButton}
                aria-label="Toggle sidebar"
              >
                {isCollapsed ? '→' : '←'}
              </button>
            )}

            {/* Navigation */}
            <nav className={styles.nav}>
            <ul className={styles.navList}>
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                const IconComponent = getMenuIcon(item.label);
                return (
                  <li key={item.path} className={styles.navItem}>
                    <Link
                      href={item.path}
                      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                      onClick={() => isMobile && setIsMobileOpen(false)}
                    >
                      <span className={styles.navIcon}>
                        <IconComponent size={20} />
                      </span>
                      {(!isCollapsed || isMobile) && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
