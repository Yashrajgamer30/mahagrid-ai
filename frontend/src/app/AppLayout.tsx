/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – App Layout
   Integrates Sidebar, Topbar, content Outlet, district selection,
   live connection state, and demo banners.
   ────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useSocket } from '@/hooks/useSocket';
import { SAFETY_DISCLAIMER, DEMO_LABEL } from '@/lib/constants';
import styles from './AppLayout.module.css';

import { useGridStore } from '@/hooks/useGridStore';

export interface AppLayoutContext {
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  connectionState: 'connected' | 'connecting' | 'disconnected' | 'error';
}

export function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('mahagrid_sidebar_collapsed') === 'true';
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('All Maharashtra');
  const { unreadNotificationsCount } = useGridStore();
  const { connectionState } = useSocket();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('mahagrid_sidebar_collapsed', String(next));
      return next;
    });
  };

  const getDotClass = () => {
    switch (connectionState) {
      case 'connected':
        return styles.pulseDotGreen;
      case 'connecting':
        return styles.pulseDotAmber;
      case 'error':
        return styles.pulseDotRed;
      default:
        return styles.pulseDotGray;
    }
  };

  return (
    <div className={styles.layout}>
      {/* Accessibility: Skip to Content */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Responsive Collapsible Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main Column */}
      <div
        className={`${styles.mainWrapper} ${
          isSidebarCollapsed ? styles.mainWrapperCollapsed : ''
        }`}
      >
        <Topbar
          onMobileMenuToggle={() => setIsMobileOpen((prev) => !prev)}
          connectionState={connectionState}
          selectedDistrict={selectedDistrict}
          onDistrictChange={setSelectedDistrict}
          unreadNotifications={unreadNotificationsCount}
        />

        <main id="main-content" className={styles.content} tabIndex={-1}>
          <Outlet
            context={{
              selectedDistrict,
              setSelectedDistrict,
              connectionState,
            } satisfies AppLayoutContext}
          />
        </main>

        <footer className={styles.footer} role="contentinfo">
          <div className={styles.footerNotice}>
            <span className={styles.pulseDot + ' ' + getDotClass()} />
            <span>
              <strong>{DEMO_LABEL}</strong>: {SAFETY_DISCLAIMER}
            </span>
          </div>
          <div className={styles.footerStatus}>
            <span>District: <strong>{selectedDistrict}</strong></span>
            <span>Route: <code>{location.pathname}</code></span>
            <span>Mode: <strong>Demo Twin</strong></span>
          </div>
        </footer>
      </div>
    </div>
  );
}
