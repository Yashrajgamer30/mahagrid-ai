/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Sidebar Navigation
   Collapsible, responsive, role-aware with dedicated navigation
   structures for Admin, Maintenance Team, and Manager portals.
   ────────────────────────────────────────────────────────────────── */

import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  Network,
  AlertTriangle,
  Zap,
  Settings,
  Users,
  Bell,
  BarChart3,
  FileText,
  FlaskConical,
  Wrench,
  Activity,
  Brain,
  Gauge,
  CircuitBoard,
  GitFork,
  Radio,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Power,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/components/ui';
import { APP_NAME } from '@/lib/constants';
import { Role } from '@/types';
import styles from './Sidebar.module.css';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  adminOnly?: boolean;
  managerOnly?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function Sidebar({
  isCollapsed,
  onToggle,
  isMobileOpen,
  onMobileClose,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const { checkSession } = useAuth();
  const { isAdmin, isManager, isFieldWorker, isEngineer } = usePermissions();
  const reducedMotion = useReducedMotion();
  const { t } = useLanguage();
  const { addToast } = useToast();

  // Determine current portal classification
  const isMaintenanceRole = isFieldWorker || isEngineer;
  const isManagerRole = isManager && !isAdmin;

  const portalType = isMaintenanceRole
    ? 'maintenance'
    : isManagerRole
    ? 'manager'
    : 'admin';

  // Quick switch role persona in demo session
  const handleSwitchPortal = async (newRole: Role, roleTitle: string) => {
    const updatedUser = {
      id: `usr-demo-${newRole.toLowerCase()}`,
      email: `${newRole.toLowerCase()}@mahagrid.gov.in`,
      name: `Officer ${roleTitle}`,
      role: newRole,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('mahagrid_user', JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('storage'));
    await checkSession();

    addToast({
      type: 'info',
      title: 'Portal Switched',
      message: `Navigating as ${roleTitle} (${newRole}).`,
    });
  };

  // Reorganized navigation tailored for each of the 3 portals
  const getNavSections = (): NavSection[] => {
    if (portalType === 'maintenance') {
      // ── Maintenance Team Navigation ──
      return [
        {
          title: t('nav.section.field', 'Field Operations'),
          items: [
            { path: '/maintenance', label: t('nav.maintenance', 'Work Orders'), icon: <Wrench size={18} />, badge: 'Active' },
            { path: '/outages', label: t('nav.outages', 'Active Outages'), icon: <Power size={18} /> },
            { path: '/fault-locator', label: t('nav.faultLocator', 'Fault Locator'), icon: <AlertTriangle size={18} /> },
          ],
        },
        {
          title: t('nav.section.spatial', 'Spatial & Grid'),
          items: [
            { path: '/map', label: t('nav.map', 'Field GIS Map'), icon: <Map size={18} /> },
            { path: '/topology', label: t('nav.topology', 'Topology View'), icon: <Network size={18} /> },
          ],
        },
        {
          title: t('nav.section.assets', 'Field Asset Registry'),
          items: [
            { path: '/transformers', label: t('nav.transformers', 'Transformers'), icon: <Activity size={18} /> },
            { path: '/feeders', label: t('nav.feeders', 'Feeders & Lines'), icon: <GitFork size={18} /> },
            { path: '/substations', label: t('nav.substations', 'Substations'), icon: <Zap size={18} /> },
            { path: '/devices', label: t('nav.devices', 'IoT Sensors'), icon: <Radio size={18} /> },
            { path: '/assets', label: t('nav.assets', 'All Assets'), icon: <CircuitBoard size={18} /> },
          ],
        },
        {
          title: t('nav.section.overview', 'Field Tools & Alerts'),
          items: [
            { path: '/ai-analysis', label: t('nav.aiAnalysis', 'AI Diagnosis'), icon: <Brain size={18} /> },
            { path: '/notifications', label: t('nav.notifications', 'Notifications'), icon: <Bell size={18} /> },
            { path: '/settings', label: t('nav.settings', 'Field Preferences'), icon: <Settings size={18} /> },
            { path: '/dashboard', label: t('nav.dashboard', 'Control Overview'), icon: <LayoutDashboard size={18} /> },
          ],
        },
      ];
    }

    if (portalType === 'manager') {
      // ── Manager Portal Navigation ──
      return [
        {
          title: t('nav.section.regional', 'Regional Oversight'),
          items: [
            { path: '/dashboard', label: t('nav.dashboard', 'Regional Dashboard'), icon: <LayoutDashboard size={18} /> },
            { path: '/map', label: t('nav.map', 'GIS Control Map'), icon: <Map size={18} /> },
            { path: '/topology', label: t('nav.topology', 'Grid Topology'), icon: <Network size={18} /> },
          ],
        },
        {
          title: t('nav.section.operations', 'Operations & Outages'),
          items: [
            { path: '/outages', label: t('nav.outages', 'Outage Severity'), icon: <Power size={18} /> },
            { path: '/maintenance', label: t('nav.maintenance', 'Team Workload'), icon: <Wrench size={18} /> },
            { path: '/fault-locator', label: t('nav.faultLocator', 'Fault Queue'), icon: <AlertTriangle size={18} /> },
          ],
        },
        {
          title: t('nav.section.assets', 'Asset Health'),
          items: [
            { path: '/assets', label: t('nav.assets', 'Asset Fleet'), icon: <CircuitBoard size={18} /> },
            { path: '/substations', label: t('nav.substations', 'Substations'), icon: <Zap size={18} /> },
            { path: '/transformers', label: t('nav.transformers', 'Transformers'), icon: <Activity size={18} /> },
            { path: '/meters', label: t('nav.meters', 'Smart Meters'), icon: <Gauge size={18} /> },
            { path: '/junctions', label: t('nav.junctions', 'Junctions'), icon: <Cpu size={18} /> },
          ],
        },
        {
          title: t('nav.section.intelligence', 'Analytics & Strategy'),
          items: [
            { path: '/analytics', label: t('nav.analytics', 'Analytics'), icon: <BarChart3 size={18} /> },
            { path: '/reports', label: t('nav.reports', 'Executive Reports'), icon: <FileText size={18} /> },
            { path: '/ai-analysis', label: t('nav.aiAnalysis', 'AI Insights'), icon: <Brain size={18} /> },
            { path: '/simulation', label: t('nav.simulation', 'Simulation Lab'), icon: <FlaskConical size={18} /> },
          ],
        },
        {
          title: t('nav.section.system', 'Administration'),
          items: [
            { path: '/settings', label: t('nav.settings', 'Rule Settings'), icon: <Settings size={18} /> },
            { path: '/notifications', label: t('nav.notifications', 'Alerts'), icon: <Bell size={18} /> },
          ],
        },
      ];
    }

    // ── Admin Portal Navigation (Comprehensive) ──
    return [
      {
        title: t('nav.section.overview', 'Control Centre'),
        items: [
          { path: '/dashboard', label: t('nav.dashboard', 'Executive Dashboard'), icon: <LayoutDashboard size={18} /> },
          { path: '/map', label: t('nav.map', 'Live GIS Map'), icon: <Map size={18} /> },
          { path: '/topology', label: t('nav.topology', 'Topology Engine'), icon: <Network size={18} /> },
        ],
      },
      {
        title: t('nav.section.assets', 'Asset Infrastructure'),
        items: [
          { path: '/assets', label: t('nav.assets', 'All Assets'), icon: <CircuitBoard size={18} /> },
          { path: '/substations', label: t('nav.substations', 'Substations'), icon: <Zap size={18} /> },
          { path: '/transformers', label: t('nav.transformers', 'Transformers'), icon: <Activity size={18} /> },
          { path: '/feeders', label: t('nav.feeders', 'Feeders & Lines'), icon: <GitFork size={18} /> },
          { path: '/junctions', label: t('nav.junctions', 'Junctions'), icon: <Cpu size={18} /> },
          { path: '/meters', label: t('nav.meters', 'Smart Meters'), icon: <Gauge size={18} /> },
          { path: '/devices', label: t('nav.devices', 'IoT Devices'), icon: <Radio size={18} /> },
        ],
      },
      {
        title: t('nav.section.operations', 'Operations & Triage'),
        items: [
          { path: '/outages', label: t('nav.outages', 'Outages & Tripping'), icon: <Power size={18} /> },
          { path: '/fault-locator', label: t('nav.faultLocator', 'Fault Locator'), icon: <AlertTriangle size={18} /> },
          { path: '/maintenance', label: t('nav.maintenance', 'Maintenance Orders'), icon: <Wrench size={18} /> },
        ],
      },
      {
        title: t('nav.section.intelligence', 'Intelligence & Twin'),
        items: [
          { path: '/ai-analysis', label: t('nav.aiAnalysis', 'AI Diagnostics'), icon: <Brain size={18} /> },
          { path: '/analytics', label: t('nav.analytics', 'Grid Analytics'), icon: <BarChart3 size={18} /> },
          { path: '/reports', label: t('nav.reports', 'Compliance Reports'), icon: <FileText size={18} /> },
          { path: '/simulation', label: t('nav.simulation', 'Simulation Lab'), icon: <FlaskConical size={18} /> },
        ],
      },
      {
        title: t('nav.section.system', 'System Management'),
        items: [
          { path: '/users', label: t('nav.users', 'User RBAC'), icon: <Users size={18} />, adminOnly: true },
          { path: '/settings', label: t('nav.settings', 'Settings & Rules'), icon: <Settings size={18} /> },
          { path: '/notifications', label: t('nav.notifications', 'Notifications'), icon: <Bell size={18} /> },
        ],
      },
    ];
  };

  const navSections = getNavSections();

  const renderNav = (collapsed: boolean) => (
    <nav className={styles.nav} aria-label="Main navigation">
      {/* Portal Identification Banner in Sidebar */}
      {!collapsed && (
        <div className={`${styles.portalPill} ${styles[`portalPill_${portalType}`]}`}>
          <div className={styles.portalPillHeader}>
            <span className={styles.portalDot} />
            <span className={styles.portalNameText}>
              {portalType === 'admin'
                ? 'ADMIN PORTAL'
                : portalType === 'maintenance'
                ? 'MAINTENANCE PORTAL'
                : 'MANAGER PORTAL'}
            </span>
          </div>
          <span className={styles.portalRoleSub}>
            {portalType === 'admin'
              ? 'Chief Grid Engineer'
              : portalType === 'maintenance'
              ? 'Field Squad Lead'
              : 'Regional Shift In-Charge'}
          </span>
        </div>
      )}

      {navSections.map((section, si) => (
        <div key={si} className={styles.section}>
          {section.title && !collapsed && (
            <div className={styles.sectionTitle}>{section.title}</div>
          )}
          {section.title && collapsed && (
            <div className={styles.sectionDivider} />
          )}
          {section.items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${styles[`navItem_${portalType}`]} ${
                  isActive ? styles.active : ''
                } ${collapsed ? styles.collapsed : ''}`
              }
              onClick={() => isMobileOpen && onMobileClose()}
              title={collapsed ? item.label : undefined}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!collapsed && (
                <div className={styles.navItemContent}>
                  <span className={styles.navLabel}>{item.label}</span>
                  {item.badge && (
                    <span className={styles.itemBadge}>{item.badge}</span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </div>
      ))}

      {/* Switch Portal Quick Actions (Demo Tool) */}
      {!collapsed && (
        <div className={styles.portalSwitcherSection}>
          <div className={styles.switcherLabel}>SWITCH ACTIVE PORTAL</div>
          <div className={styles.switcherButtons}>
            <button
              type="button"
              className={`${styles.switchBtn} ${portalType === 'admin' ? styles.switchBtnActive : ''}`}
              onClick={() => handleSwitchPortal(Role.ADMIN, 'Chief Grid Engineer')}
              title="Admin Portal: Full SCADA & User Management"
            >
              Admin
            </button>
            <button
              type="button"
              className={`${styles.switchBtn} ${portalType === 'maintenance' ? styles.switchBtnActive : ''}`}
              onClick={() => handleSwitchPortal(Role.FIELD_WORKER, 'Maintenance Squad Lead')}
              title="Maintenance Portal: Work Orders & Restorations"
            >
              Field
            </button>
            <button
              type="button"
              className={`${styles.switchBtn} ${portalType === 'manager' ? styles.switchBtnActive : ''}`}
              onClick={() => handleSwitchPortal(Role.MANAGER, 'Regional Shift In-Charge')}
              title="Manager Portal: Regional Outage Severity & Approvals"
            >
              Manager
            </button>
          </div>
        </div>
      )}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`${styles.sidebar} ${styles[`sidebar_${portalType}`]} ${
          isCollapsed ? styles.sidebarCollapsed : ''
        }`}
        aria-label="Sidebar"
      >
        <div className={styles.logo}>
          {!isCollapsed && (
            <div className={styles.logoBrandCol}>
              <span className={styles.logoText}>
                <Zap size={20} className={styles.logoIcon} />
                {APP_NAME}
              </span>
              <span className={styles.logoTwinTag}>SCADA DIGITAL TWIN</span>
            </div>
          )}
          {isCollapsed && <Zap size={20} className={styles.logoIcon} />}
          <button
            className={styles.collapseBtn}
            onClick={onToggle}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        {renderNav(isCollapsed)}
      </aside>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className={styles.mobileOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
            />
            <motion.aside
              className={`${styles.mobileSidebar} ${styles[`sidebar_${portalType}`]}`}
              initial={reducedMotion ? {} : { x: '-100%' }}
              animate={{ x: 0 }}
              exit={reducedMotion ? {} : { x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              aria-label="Mobile navigation"
            >
              <div className={styles.logo}>
                <div className={styles.logoBrandCol}>
                  <span className={styles.logoText}>
                    <Zap size={20} className={styles.logoIcon} />
                    {APP_NAME}
                  </span>
                  <span className={styles.logoTwinTag}>SCADA DIGITAL TWIN</span>
                </div>
              </div>
              {renderNav(false)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
