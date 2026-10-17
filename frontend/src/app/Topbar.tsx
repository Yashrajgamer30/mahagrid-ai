/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Topbar
   City selector, global search, portal badge, socket connection status,
   role persona switcher, quick language selector, notifications,
   and comprehensive profile menu.
   ────────────────────────────────────────────────────────────────── */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  LogOut,
  User as UserIcon,
  Wifi,
  WifiOff,
  MapPin,
  Zap,
  Wrench,
  BarChart3,
  Check,
  Palette,
  Globe,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/components/ui';
import { MAHARASHTRA_DISTRICTS } from '@/lib/constants';
import { ROLE_LABELS, Role } from '@/types';
import styles from './Topbar.module.css';

interface TopbarProps {
  onMobileMenuToggle: () => void;
  connectionState: 'connected' | 'connecting' | 'disconnected' | 'error';
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  unreadNotifications: number;
}

export function Topbar({
  onMobileMenuToggle,
  connectionState,
  selectedDistrict,
  onDistrictChange,
  unreadNotifications,
}: TopbarProps) {
  const { user, logout, checkSession } = useAuth();
  const { isAdmin, isManager, isFieldWorker, isEngineer } = usePermissions();
  const { t, language, setLanguage, supportedLanguages } = useLanguage();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [searchValue, setSearchValue] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/assets?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleSwitchPersona = async (newRole: Role, roleTitle: string) => {
    setShowUserMenu(false);
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
      title: 'Portal Role Switched',
      message: `Active persona is now ${roleTitle} (${newRole}).`,
    });

    if (newRole === Role.FIELD_WORKER || newRole === Role.ENGINEER) {
      navigate('/maintenance');
    } else {
      navigate('/dashboard');
    }
  };

  const connectionLabel = {
    connected: t('topbar.connected', 'Connected'),
    connecting: t('topbar.connecting', 'Connecting…'),
    disconnected: t('topbar.disconnected', 'Disconnected'),
    error: 'Connection Error',
  }[connectionState];

  const ConnectionIcon = connectionState === 'connected' ? Wifi : WifiOff;

  // Portal identification
  const isMaintenance = isFieldWorker || isEngineer;
  const isMgr = isManager && !isAdmin;
  const portalName = isMaintenance
    ? t('portal.maintenance', 'Maintenance Portal')
    : isMgr
    ? t('portal.manager', 'Manager Portal')
    : t('portal.admin', 'Admin Portal');

  const portalAccentClass = isMaintenance
    ? styles.portalBadgeMaintenance
    : isMgr
    ? styles.portalBadgeManager
    : styles.portalBadgeAdmin;

  const PortalIcon = isMaintenance ? Wrench : isMgr ? BarChart3 : Zap;

  return (
    <header className={styles.topbar} role="banner">
      {/* Mobile menu button */}
      <button
        className={styles.mobileMenuBtn}
        onClick={onMobileMenuToggle}
        aria-label="Toggle navigation menu"
      >
        <Menu size={20} />
      </button>

      {/* District selector */}
      <div className={styles.districtSelector}>
        <MapPin size={14} className={styles.districtIcon} />
        <select
          value={selectedDistrict}
          onChange={(e) => onDistrictChange(e.target.value)}
          className={styles.districtSelect}
          aria-label={t('topbar.districtSelect', 'Select Maharashtra Circle')}
        >
          {MAHARASHTRA_DISTRICTS.map((d: string) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Active Portal Badge (Desktop) */}
      <div className={`${styles.portalIndicatorBadge} ${portalAccentClass}`} title="Active Persona Portal">
        <PortalIcon size={13} />
        <span>{portalName}</span>
      </div>

      {/* Global Search */}
      <form className={styles.searchForm} onSubmit={handleSearch}>
        <Search size={15} className={styles.searchIcon} />
        <input
          type="search"
          placeholder={t('topbar.searchPlaceholder', 'Search 33kV substations, transformers, feeders, faults…')}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={styles.searchInput}
          aria-label="Global search"
        />
      </form>

      <div className={styles.rightSection}>
        {/* Quick Language Toggle */}
        <div className={styles.langSelectorBox}>
          <Globe size={13} className={styles.langIcon} />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'mr')}
            className={styles.langSelect}
            aria-label="Select language"
          >
            {supportedLanguages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeLabel}
              </option>
            ))}
          </select>
        </div>

        {/* Connection Status */}
        <div
          className={`${styles.connectionStatus} ${styles[connectionState]}`}
          title={connectionLabel}
          aria-label={`Socket connection: ${connectionLabel}`}
        >
          <ConnectionIcon size={14} />
          <span className={styles.connectionLabel}>{connectionLabel}</span>
        </div>

        {/* Compact Demo badge */}
        <span className={styles.demoBadge} aria-label="Demo mode active">
          {t('topbar.demoMode', 'DEMO TWIN')}
        </span>

        {/* Notifications Button */}
        <button
          className={styles.iconBtn}
          onClick={() => navigate('/notifications')}
          aria-label={`Notifications${unreadNotifications > 0 ? `, ${unreadNotifications} unread` : ''}`}
        >
          <Bell size={18} />
          {unreadNotifications > 0 && (
            <span className={styles.notifBadge}>
              {unreadNotifications > 99 ? '99+' : unreadNotifications}
            </span>
          )}
        </button>

        {/* User menu & Profile Menu */}
        <div className={styles.userMenu} ref={userMenuRef}>
          <button
            className={styles.userBtn}
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-expanded={showUserMenu}
            aria-haspopup="menu"
          >
            <div className={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || 'Officer'}</span>
              <span className={styles.userRole}>
                {user?.role ? ROLE_LABELS[user.role] : 'Admin'}
              </span>
            </div>
          </button>

          {showUserMenu && (
            <div className={styles.dropdown} role="menu">
              <div className={styles.dropdownHeader}>
                <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '13px' }}>
                  {user?.name || 'Officer'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  {user?.email || 'officer@mahagrid.gov.in'}
                </div>
                <div className={styles.dropdownRoleTag}>
                  {user?.role || 'ADMIN'} • {t('status.sync', 'Active Session')}
                </div>
              </div>

              <div className={styles.dropdownDivider} />

              {/* Persona Quick Switcher */}
              <div className={styles.personaSwitchTitle}>{t('topbar.switchPortal', 'SWITCH ROLE PORTAL (DEMO)')}</div>
              
              <button
                type="button"
                className={`${styles.personaItem} ${isAdmin ? styles.personaItemActive : ''}`}
                onClick={() => handleSwitchPersona(Role.ADMIN, 'Chief Grid Engineer')}
                role="menuitem"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={14} color="#10b981" />
                  <div>
                    <div style={{ fontWeight: 600 }}>{t('portal.admin', 'Admin Portal')}</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>All Assets, Users & Config</div>
                  </div>
                </div>
                {isAdmin && <Check size={14} color="#10b981" />}
              </button>

              <button
                type="button"
                className={`${styles.personaItem} ${isMaintenance ? styles.personaItemActive : ''}`}
                onClick={() => handleSwitchPersona(Role.FIELD_WORKER, 'Maintenance Squad Lead')}
                role="menuitem"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Wrench size={14} color="#D45C3D" />
                  <div>
                    <div style={{ fontWeight: 600 }}>{t('portal.maintenance', 'Maintenance Portal')}</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>Work Orders, Repairs & Restorations</div>
                  </div>
                </div>
                {isMaintenance && <Check size={14} color="#D45C3D" />}
              </button>

              <button
                type="button"
                className={`${styles.personaItem} ${isMgr ? styles.personaItemActive : ''}`}
                onClick={() => handleSwitchPersona(Role.MANAGER, 'Regional Shift In-Charge')}
                role="menuitem"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BarChart3 size={14} color="#38bdf8" />
                  <div>
                    <div style={{ fontWeight: 600 }}>{t('portal.manager', 'Manager Portal')}</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>Regional Outages & Analytics</div>
                  </div>
                </div>
                {isMgr && <Check size={14} color="#38bdf8" />}
              </button>

              <div className={styles.dropdownDivider} />

              {/* ── PROFILE MENU (Required by specification) ── */}
              <button
                className={styles.dropdownItem}
                onClick={() => { setShowUserMenu(false); navigate('/settings?tab=profile'); }}
                role="menuitem"
              >
                <UserIcon size={14} />
                <span>{t('topbar.myProfile', 'My Profile')}</span>
              </button>

              <button
                className={styles.dropdownItem}
                onClick={() => { setShowUserMenu(false); navigate('/settings?tab=appearance'); }}
                role="menuitem"
              >
                <Palette size={14} />
                <span>{t('topbar.appearance', 'Appearance & Theme')}</span>
              </button>

              <button
                className={styles.dropdownItem}
                onClick={() => { setShowUserMenu(false); navigate('/settings?tab=language'); }}
                role="menuitem"
              >
                <Globe size={14} />
                <span>{t('topbar.language', 'Language & Region')}</span>
              </button>

              <button
                className={styles.dropdownItem}
                onClick={() => { setShowUserMenu(false); navigate('/settings?tab=preferences'); }}
                role="menuitem"
              >
                <Sliders size={14} />
                <span>{t('topbar.preferences', 'Preferences')}</span>
              </button>

              <button
                className={styles.dropdownItem}
                onClick={() => { setShowUserMenu(false); navigate('/settings?tab=security'); }}
                role="menuitem"
              >
                <ShieldCheck size={14} />
                <span>{t('topbar.security', 'Security')}</span>
              </button>

              <button
                className={styles.dropdownItem}
                onClick={() => { setShowUserMenu(false); navigate('/notifications'); }}
                role="menuitem"
              >
                <Bell size={14} />
                <span>{t('nav.notifications', 'Notifications')}</span>
              </button>

              <div className={styles.dropdownDivider} />

              <button
                className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                onClick={() => { setShowUserMenu(false); logout(); navigate('/login'); }}
                role="menuitem"
              >
                <LogOut size={14} />
                <span>{t('topbar.signOut', 'Sign Out')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
