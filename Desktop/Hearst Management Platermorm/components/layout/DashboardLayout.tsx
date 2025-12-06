'use client';

import React from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { useSidebar } from './SidebarContext';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isCollapsed, isMobile, isTablet } = useSidebar();

  return (
    <div className={styles.container}>
      <Sidebar />
      <Topbar />
      <main className={`${styles.main} ${isCollapsed && !isMobile ? styles.mainCollapsed : ''}`}>
        {children}
      </main>
    </div>
  );
}
