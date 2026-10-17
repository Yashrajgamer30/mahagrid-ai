/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – System Settings & Preferences (/settings)
   Multi-tab workspace: Appearance, Language & Region, Notifications,
   Map & GIS, Dashboard & Data, Profile & Security, and Role Thresholds.
   Immediate local persistence, live previews, and honest demo handling.
   ────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import {
  Settings,
  Palette,
  Globe,
  Bell,
  Map as MapIcon,
  Sliders,
  ShieldCheck,
  RotateCcw,
  Check,
  Info,
  Lock,
  Database,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Button, Badge, useToast, Dialog } from '@/components/ui';
import { useTheme, THEME_OPTIONS } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useGridStore } from '@/hooks/useGridStore';
import { MAHARASHTRA_CITIES } from '@/services/gridStore';
import type { AppLayoutContext } from '@/app/AppLayout';
import styles from './SettingsPage.module.css';

type SettingsTab =
  | 'appearance'
  | 'language'
  | 'notifications'
  | 'map'
  | 'data'
  | 'profile'
  | 'preferences';

export function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedDistrict, setSelectedDistrict } = useOutletContext<AppLayoutContext>();
  const { user, checkSession } = useAuth();
  const { isAdmin, isFieldWorker } = usePermissions();
  const { addToast } = useToast();

  // Theme & Preferences Context
  const {
    theme,
    setTheme,
    density,
    setDensity,
    reducedMotion,
    setReducedMotion,
    restrainedAnimations,
    setRestrainedAnimations,
    resetToDefaults: resetThemeDefaults,
  } = useTheme();

  // Language Context
  const { language, setLanguage, t, formatDate, formatNumber, supportedLanguages } = useLanguage();

  // Grid Store for thresholds
  const { thresholds, updateThreshold, resetToBaseline } = useGridStore(selectedDistrict);

  // Active Tab from URL search params
  const tabParam = searchParams.get('tab');
  const activeTab: SettingsTab =
    tabParam === 'security'
      ? 'profile'
      : tabParam && ['appearance', 'language', 'notifications', 'map', 'data', 'profile', 'preferences'].includes(tabParam)
      ? (tabParam as SettingsTab)
      : 'appearance';

  const handleTabChange = (newTab: SettingsTab) => {
    setSearchParams({ tab: newTab });
  };

  const samplePreviewDate = '2026-10-16T21:45:00Z';

  // Local Form States
  const [localCity, setLocalCity] = useState(selectedDistrict);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // Notifications State
  const [notifIncident, setNotifIncident] = useState(true);
  const [notifWorkOrders, setNotifWorkOrders] = useState(true);
  const [notifThermal, setNotifThermal] = useState(true);
  const [notifSound, setNotifSound] = useState(false);

  // Map State
  const [mapBaseLayer, setMapBaseLayer] = useState<'osm' | 'topo' | 'clean'>('osm');
  const [mapShowCorridors, setMapShowCorridors] = useState(true);
  const [mapShowSubstations, setMapShowSubstations] = useState(true);
  const [mapShowFaults, setMapShowFaults] = useState(true);
  const [mapShowLegend, setMapShowLegend] = useState(true);

  // Data / Dashboard State
  const [dataLanding, setDataLanding] = useState<string>('/dashboard');
  const [dataPageSize, setDataPageSize] = useState<number>(25);
  const [dataRefreshCadence, setDataRefreshCadence] = useState<number>(10);

  // Profile Edit State
  const [displayName, setDisplayName] = useState(user?.name || 'Officer');
  const [contactPhone, setContactPhone] = useState('+91 98220 12345');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Save Handlers
  const handleApplyAppearance = () => {
    addToast({
      type: 'success',
      title: 'Appearance Applied',
      message: `Theme set to ${theme.toUpperCase()}, density is ${density}.`,
    });
  };

  const handleSaveDistrict = () => {
    setSelectedDistrict(localCity);
    addToast({
      type: 'success',
      title: 'Operational Circle Updated',
      message: `Default jurisdiction set to ${localCity}.`,
    });
  };

  const handleSaveNotifications = () => {
    addToast({
      type: 'success',
      title: 'Notification Rules Saved',
      message: 'In-app notification filters updated successfully.',
    });
  };

  const handleSaveMapPreferences = () => {
    addToast({
      type: 'success',
      title: 'Map Preferences Saved',
      message: 'Default GIS layers and overlays updated.',
    });
  };

  const handleSaveProfile = () => {
    if (user) {
      const updated = { ...user, name: displayName };
      localStorage.setItem('mahagrid_user', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      checkSession();
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: `Display name updated to ${displayName}.`,
      });
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      addToast({ type: 'error', title: 'Passcode Required', message: 'Please enter your current passcode.' });
      return;
    }
    if (newPassword.length < 6) {
      addToast({ type: 'error', title: 'Passcode Length', message: 'New passcode must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast({ type: 'error', title: 'Mismatch', message: 'New passcode and confirmation do not match.' });
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    addToast({
      type: 'info',
      title: 'Passcode Verified (Demo)',
      message: 'Passcode change validated. In this ENTC engineering demo, LDAP server commits are simulated.',
    });
  };

  const handleResetBaselineState = () => {
    resetToBaseline();
    resetThemeDefaults();
    setIsResetDialogOpen(false);
    addToast({
      type: 'info',
      title: 'System Restored',
      message: 'Baseline Maharashtra digital twin parameters restored.',
    });
  };

  return (
    <div className={styles.settingsContainer}>
      <PageHeader
        title={t('settings.title', 'Grid Control Settings & Preferences')}
        subtitle={t('settings.subtitle', 'Appearance, language localization, telemetry thresholds, notification rules, and role preferences.')}
        category="System"
        icon={<Settings size={22} />}
        district={selectedDistrict}
        actions={
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<RotateCcw size={14} />}
            onClick={() => setIsResetDialogOpen(true)}
          >
            {t('action.reset', 'Reset to Defaults')}
          </Button>
        }
      />

      {/* ── Multi-Tab Navigation Bar ── */}
      <div className={styles.tabNav} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'appearance'}
          className={`${styles.tabBtn} ${activeTab === 'appearance' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabChange('appearance')}
        >
          <Palette size={15} />
          <span>{t('settings.tab.appearance', 'Appearance & Theme')}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'language'}
          className={`${styles.tabBtn} ${activeTab === 'language' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabChange('language')}
        >
          <Globe size={15} />
          <span>{t('settings.tab.language', 'Language & Region')}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'notifications'}
          className={`${styles.tabBtn} ${activeTab === 'notifications' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabChange('notifications')}
        >
          <Bell size={15} />
          <span>{t('settings.tab.notifications', 'Notifications')}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'map'}
          className={`${styles.tabBtn} ${activeTab === 'map' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabChange('map')}
        >
          <MapIcon size={15} />
          <span>{t('settings.tab.map', 'Map & GIS')}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'data'}
          className={`${styles.tabBtn} ${activeTab === 'data' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabChange('data')}
        >
          <Database size={15} />
          <span>{t('settings.tab.data', 'Dashboard & Data')}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'profile'}
          className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabChange('profile')}
        >
          <ShieldCheck size={15} />
          <span>{t('settings.tab.profile', 'Profile & Security')}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'preferences'}
          className={`${styles.tabBtn} ${activeTab === 'preferences' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabChange('preferences')}
        >
          <Sliders size={15} />
          <span>{isAdmin ? 'System Thresholds' : isFieldWorker ? 'Field Preferences' : 'Regional Rules'}</span>
        </button>
      </div>

      {/* ── TAB 1: APPEARANCE & THEME ── */}
      {activeTab === 'appearance' && (
        <div className={styles.contentArea}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeaderRow}>
              <div className={styles.cardHeaderLeft}>
                <div className={styles.iconCircle}>
                  <Palette size={20} />
                </div>
                <div>
                  <h2 className={styles.cardTitle}>Global Theme Selector</h2>
                  <p className={styles.cardSubtitle}>
                    Select your visual environment. Themes instantly adapt navigation, cards, tables, maps, charts, and dialogues without reloading.
                  </p>
                </div>
              </div>
              <Badge variant="primary">ACTIVE: {theme.toUpperCase()}</Badge>
            </div>

            {/* Three Visual Theme Cards with Previews */}
            <div className={styles.themeGrid}>
              {THEME_OPTIONS.map((opt) => {
                const isActive = theme === opt.id;
                return (
                  <div
                    key={opt.id}
                    className={`${styles.themeCard} ${isActive ? styles.themeCardActive : ''}`}
                    onClick={() => setTheme(opt.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${opt.title} Theme`}
                  >
                    {/* Live Preview Miniature */}
                    <div
                      className={styles.themePreviewFrame}
                      style={{ background: opt.bgPreview }}
                    >
                      <div className={styles.themePreviewHeader}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <span className={styles.themePreviewDot} style={{ background: opt.accent }} />
                          <span className={styles.themePreviewDot} style={{ background: 'rgba(255,255,255,0.4)' }} />
                        </div>
                        <span style={{ fontSize: '9px', fontWeight: 700, color: opt.accent, letterSpacing: '0.05em' }}>
                          50.02 Hz
                        </span>
                      </div>
                      <div
                        className={styles.themePreviewMiniCard}
                        style={{ background: opt.cardPreview }}
                      >
                        <span style={{ fontSize: '10px', color: opt.id === 'light' ? '#282D29' : '#FFFFFF', fontWeight: 600 }}>
                          MahaGrid AI
                        </span>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: opt.accent }} />
                      </div>
                    </div>

                    <div className={styles.themeCardText}>
                      <div className={styles.themeCardTitleRow}>
                        <span className={styles.themeCardTitle}>{opt.title}</span>
                        {isActive && <span className={styles.activeThemeBadge}>Active</span>}
                      </div>
                      <p className={styles.themeCardDesc}>{opt.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Density & Ergonomics */}
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Display Density</span>
                <span className={styles.settingHint}>Adjust padding across tables, telemetry feeds, and module headers.</span>
              </div>
              <div className={styles.segmentedGroup}>
                <button
                  type="button"
                  className={`${styles.segmentBtn} ${density === 'comfortable' ? styles.segmentBtnActive : ''}`}
                  onClick={() => setDensity('comfortable')}
                >
                  Comfortable
                </button>
                <button
                  type="button"
                  className={`${styles.segmentBtn} ${density === 'compact' ? styles.segmentBtnActive : ''}`}
                  onClick={() => setDensity('compact')}
                >
                  Compact
                </button>
              </div>
            </div>

            {/* Reduced Motion Toggle */}
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Reduced Motion Mode</span>
                <span className={styles.settingHint}>Minimizes animations, eliminates layout shifts, and disables pulsing markers.</span>
              </div>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                />
                <span className={styles.toggleSlider} />
              </label>
            </div>

            {/* Restrained Animations Toggle */}
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Restrained Background Telemetry Pulses</span>
                <span className={styles.settingHint}>Disables busy particles and ambient light sweeps behind data-heavy tables and GIS maps.</span>
              </div>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={restrainedAnimations}
                  onChange={(e) => setRestrainedAnimations(e.target.checked)}
                />
                <span className={styles.toggleSlider} />
              </label>
            </div>

            <div className={styles.actionsBar}>
              <Button variant="secondary" onClick={resetThemeDefaults}>
                Restore Defaults
              </Button>
              <Button variant="primary" onClick={handleApplyAppearance}>
                Apply Preferences
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: LANGUAGE & REGION ── */}
      {activeTab === 'language' && (
        <div className={styles.contentArea}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeaderRow}>
              <div className={styles.cardHeaderLeft}>
                <div className={styles.iconCircle}>
                  <Globe size={20} />
                </div>
                <div>
                  <h2 className={styles.cardTitle}>Language & Regional Localization</h2>
                  <p className={styles.cardSubtitle}>
                    Select your official language. Changes update all navigation titles, buttons, status indicators, and alerts. Missing translations safely fall back to English.
                  </p>
                </div>
              </div>
              <Badge variant="primary">{language.toUpperCase()}</Badge>
            </div>

            {/* Language Cards */}
            <div className={styles.languageGrid}>
              {supportedLanguages.map((l) => {
                const isSelected = language === l.code;
                return (
                  <div
                    key={l.code}
                    className={`${styles.languageCard} ${isSelected ? styles.languageCardActive : ''}`}
                    onClick={() => {
                      setLanguage(l.code);
                      addToast({
                        type: 'info',
                        title: 'Language Updated',
                        message: `Switched language to ${l.nativeLabel} (${l.label}).`,
                      });
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${l.label}`}
                  >
                    <div className={styles.langCardLeft}>
                      <span className={styles.langFlag}>{l.flag}</span>
                      <div>
                        <div className={styles.langNameNative}>{l.nativeLabel}</div>
                        <div className={styles.langNameEn}>{l.label}</div>
                      </div>
                    </div>
                    {isSelected && <Check size={18} color="var(--color-primary)" />}
                  </div>
                );
              })}
            </div>

            {/* Regional Formatting Preview */}
            <div className={styles.previewBox}>
              <div className={styles.previewTitle}>Live Regional Telemetry Preview</div>
              <div className={styles.previewGrid}>
                <div className={styles.previewItem}>
                  <span>Localized Date & Time:</span>
                  <strong>{formatDate(samplePreviewDate)}</strong>
                </div>
                <div className={styles.previewItem}>
                  <span>Localized Asset Count:</span>
                  <strong>{formatNumber(24850)} Assets</strong>
                </div>
                <div className={styles.previewItem}>
                  <span>State Peak Demand:</span>
                  <strong>{formatNumber(22840)} MW</strong>
                </div>
                <div className={styles.previewItem}>
                  <span>SLDC Synchronization:</span>
                  <strong style={{ color: 'var(--color-ok)' }}>{t('status.sync', 'Synchronized')}</strong>
                </div>
              </div>
            </div>

            {/* Primary Jurisdiction Circle */}
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Primary Operational Circle</span>
                <span className={styles.settingHint}>Default Maharashtra jurisdiction loaded when accessing the SCADA control centre.</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  value={localCity}
                  onChange={(e) => setLocalCity(e.target.value)}
                  className={styles.standardSelect}
                >
                  {MAHARASHTRA_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <Button variant="primary" size="sm" onClick={handleSaveDistrict}>
                  Save Circle
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: NOTIFICATIONS ── */}
      {activeTab === 'notifications' && (
        <div className={styles.contentArea}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeaderRow}>
              <div className={styles.cardHeaderLeft}>
                <div className={styles.iconCircle}>
                  <Bell size={20} />
                </div>
                <div>
                  <h2 className={styles.cardTitle}>In-App Notification Preferences</h2>
                  <p className={styles.cardSubtitle}>
                    Configure supervisory event triggers and alert categories. All notifications are broadcasted through the live in-browser twin engine.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Critical Grid Incident Alerts</span>
                <span className={styles.settingHint}>Instant banner notifications for 400kV line tripping, busbar differential trips, and sub-second frequency dips.</span>
              </div>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={notifIncident}
                  onChange={(e) => setNotifIncident(e.target.checked)}
                />
                <span className={styles.toggleSlider} />
              </label>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Field Work-Order & Dispatch Updates</span>
                <span className={styles.settingHint}>Receive notifications when a substation crew acknowledges, diagnoses, or completes a field repair.</span>
              </div>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={notifWorkOrders}
                  onChange={(e) => setNotifWorkOrders(e.target.checked)}
                />
                <span className={styles.toggleSlider} />
              </label>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Substation Health & Thermal Warnings</span>
                <span className={styles.settingHint}>Threshold alerts when transformer winding temperature exceeds 85°C or dissolved gas analysis (DGA) spikes.</span>
              </div>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={notifThermal}
                  onChange={(e) => setNotifThermal(e.target.checked)}
                />
                <span className={styles.toggleSlider} />
              </label>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Audio Alert Chime</span>
                <span className={styles.settingHint}>Play an audible telemetry pulse tone when critical breaker trips occur (disabled by default).</span>
              </div>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={notifSound}
                  onChange={(e) => setNotifSound(e.target.checked)}
                />
                <span className={styles.toggleSlider} />
              </label>
            </div>

            {/* Transparent Demo Notice */}
            <div className={styles.disclaimerBox}>
              <Info size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Telemetry Architecture Notice:</strong> Email and SMS alerts require connection to a certified utility telecommunications gateway (MSEDCL LDAP/SMS server). In this standalone digital twin demo, all alerts are delivered through the in-browser notification center.
              </div>
            </div>

            <div className={styles.actionsBar}>
              <Button variant="primary" onClick={handleSaveNotifications}>
                Save Notification Preferences
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: MAP & GIS ── */}
      {activeTab === 'map' && (
        <div className={styles.contentArea}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeaderRow}>
              <div className={styles.cardHeaderLeft}>
                <div className={styles.iconCircle}>
                  <MapIcon size={20} />
                </div>
                <div>
                  <h2 className={styles.cardTitle}>GIS & Spatial Map Defaults</h2>
                  <p className={styles.cardSubtitle}>
                    Configure spatial camera behavior, default cartographic layer, and asset visibility overlays. Map controls use non-overlapping anchor positioning.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.inputFieldWrapper}>
                <label className={styles.inputFieldLabel}>Default Geographic Region</label>
                <select
                  value={localCity}
                  onChange={(e) => setLocalCity(e.target.value)}
                  className={styles.standardSelect}
                >
                  {MAHARASHTRA_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className={styles.inputFieldWrapper}>
                <label className={styles.inputFieldLabel}>Cartographic Base Layer</label>
                <select
                  value={mapBaseLayer}
                  onChange={(e) => setMapBaseLayer(e.target.value as 'osm' | 'topo' | 'clean')}
                  className={styles.standardSelect}
                >
                  <option value="osm">OpenStreetMap Standard</option>
                  <option value="topo">Topographic Relief</option>
                  <option value="clean">Clean Minimalist Carto</option>
                </select>
              </div>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>765kV & 400kV Bulk Transmission Corridors</span>
                <span className={styles.settingHint}>Display animated high-voltage evacuation lines and conductor flow directions.</span>
              </div>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={mapShowCorridors}
                  onChange={(e) => setMapShowCorridors(e.target.checked)}
                />
                <span className={styles.toggleSlider} />
              </label>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>33kV / 11kV Distribution Substations</span>
                <span className={styles.settingHint}>Render interactive vector markers for all primary substations across Maharashtra circles.</span>
              </div>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={mapShowSubstations}
                  onChange={(e) => setMapShowSubstations(e.target.checked)}
                />
                <span className={styles.toggleSlider} />
              </label>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Active Fault Trip Pulses</span>
                <span className={styles.settingHint}>Highlight tripping events with animated glowing rings on the GIS canvas.</span>
              </div>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={mapShowFaults}
                  onChange={(e) => setMapShowFaults(e.target.checked)}
                />
                <span className={styles.toggleSlider} />
              </label>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Display Dynamic Map Legend</span>
                <span className={styles.settingHint}>Show voltage and asset type legend overlay at bottom-left corner of the GIS map.</span>
              </div>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={mapShowLegend}
                  onChange={(e) => setMapShowLegend(e.target.checked)}
                />
                <span className={styles.toggleSlider} />
              </label>
            </div>

            <div className={styles.disclaimerBox}>
              <Info size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Map Tile Rendering:</strong> Tiles are rendered in their natural cartographic clarity with 0 dark-inversion filters to ensure satellite imagery and topography remain legible.
              </div>
            </div>

            <div className={styles.actionsBar}>
              <Button variant="primary" onClick={handleSaveMapPreferences}>
                Save Map Configuration
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: DASHBOARD & DATA ── */}
      {activeTab === 'data' && (
        <div className={styles.contentArea}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeaderRow}>
              <div className={styles.cardHeaderLeft}>
                <div className={styles.iconCircle}>
                  <Database size={20} />
                </div>
                <div>
                  <h2 className={styles.cardTitle}>Dashboard & Telemetry Settings</h2>
                  <p className={styles.cardSubtitle}>
                    Control default navigation targets, table pagination, and telemetry refresh frequency.
                  </p>
                </div>
              </div>
              <Badge variant="muted">DEMO SIMULATOR</Badge>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.inputFieldWrapper}>
                <label className={styles.inputFieldLabel}>Default Landing Workspace</label>
                <select
                  value={dataLanding}
                  onChange={(e) => setDataLanding(e.target.value)}
                  className={styles.standardSelect}
                >
                  <option value="/dashboard">Executive Dashboard (/dashboard)</option>
                  <option value="/map">Live GIS Map (/map)</option>
                  <option value="/maintenance">Field Maintenance Terminal (/maintenance)</option>
                </select>
              </div>

              <div className={styles.inputFieldWrapper}>
                <label className={styles.inputFieldLabel}>Table Page Size</label>
                <select
                  value={dataPageSize}
                  onChange={(e) => setDataPageSize(Number(e.target.value))}
                  className={styles.standardSelect}
                >
                  <option value={10}>10 rows per page</option>
                  <option value={25}>25 rows per page (Recommended)</option>
                  <option value={50}>50 rows per page</option>
                </select>
              </div>

              <div className={styles.inputFieldWrapper}>
                <label className={styles.inputFieldLabel}>Simulation Telemetry Pulse Rate</label>
                <select
                  value={dataRefreshCadence}
                  onChange={(e) => setDataRefreshCadence(Number(e.target.value))}
                  className={styles.standardSelect}
                >
                  <option value={5}>Every 5 seconds (High fidelity)</option>
                  <option value={10}>Every 10 seconds (Balanced)</option>
                  <option value={30}>Every 30 seconds (Low CPU)</option>
                </select>
              </div>
            </div>

            <div className={styles.disclaimerBox}>
              <Info size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Simulation Integrity:</strong> All data curves and grid state estimations are calculated deterministically using physical impedance models of Maharashtra distribution networks.
              </div>
            </div>

            <div className={styles.actionsBar}>
              <Button variant="primary" onClick={() => addToast({ type: 'success', title: 'Data Settings Saved', message: 'Telemetry parameters updated.' })}>
                Save Data Preferences
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 6: PROFILE & SECURITY ── */}
      {activeTab === 'profile' && (
        <div className={styles.contentArea}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeaderRow}>
              <div className={styles.cardHeaderLeft}>
                <div className={styles.iconCircle}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className={styles.cardTitle}>Officer Profile & Session Security</h2>
                  <p className={styles.cardSubtitle}>
                    Manage authenticated credentials, duty station contact information, and terminal security.
                  </p>
                </div>
              </div>
              <Badge variant="primary">{user?.role || 'ADMIN'}</Badge>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.inputFieldWrapper}>
                <label className={styles.inputFieldLabel}>Duty Officer Full Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={styles.standardInput}
                />
              </div>

              <div className={styles.inputFieldWrapper}>
                <label className={styles.inputFieldLabel}>Officer Work Email / ID</label>
                <input
                  type="email"
                  value={user?.email || 'officer@mahagrid.gov.in'}
                  disabled
                  className={styles.standardInput}
                  style={{ opacity: 0.65, cursor: 'not-allowed' }}
                />
              </div>

              <div className={styles.inputFieldWrapper}>
                <label className={styles.inputFieldLabel}>Official Mobile (Control Room Dispatch)</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className={styles.standardInput}
                />
              </div>

              <div className={styles.inputFieldWrapper}>
                <label className={styles.inputFieldLabel}>Assigned Authority Circle</label>
                <input
                  type="text"
                  value={selectedDistrict}
                  disabled
                  className={styles.standardInput}
                  style={{ opacity: 0.65, cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div className={styles.actionsBar} style={{ borderTop: 'none', paddingTop: 0 }}>
              <Button variant="primary" onClick={handleSaveProfile}>
                Update Profile Info
              </Button>
            </div>

            <div style={{ height: 1, background: 'var(--color-border)', margin: 'var(--space-2) 0' }} />

            {/* Passcode Update Section */}
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-md)', margin: '0 0 var(--space-2) 0' }}>
              Terminal Security Passcode
            </h3>

            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className={styles.formGrid}>
                <div className={styles.inputFieldWrapper}>
                  <label className={styles.inputFieldLabel}>Current Passcode</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={styles.standardInput}
                  />
                </div>

                <div className={styles.inputFieldWrapper}>
                  <label className={styles.inputFieldLabel}>New Security Passcode</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.standardInput}
                  />
                </div>

                <div className={styles.inputFieldWrapper}>
                  <label className={styles.inputFieldLabel}>Confirm New Passcode</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.standardInput}
                  />
                </div>
              </div>

              <div className={styles.actionsBar}>
                <Button type="submit" variant="primary">
                  Update Security Passcode
                </Button>
              </div>
            </form>

            <div className={styles.disclaimerBox}>
              <Lock size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Security Protocol:</strong> Production passwords and tokens are never stored in localStorage. Passwords are encrypted and validated in session memory.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 7: ROLE-SPECIFIC OPERATIONAL THRESHOLDS ── */}
      {activeTab === 'preferences' && (
        <div className={styles.contentArea}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeaderRow}>
              <div className={styles.cardHeaderLeft}>
                <div className={styles.iconCircle}>
                  <Sliders size={20} />
                </div>
                <div>
                  <h2 className={styles.cardTitle}>
                    {isAdmin
                      ? 'System Protection Alert Thresholds'
                      : isFieldWorker
                      ? 'Field Operations & Dispatch Rules'
                      : 'Regional Demand & Outage Rules'}
                  </h2>
                  <p className={styles.cardSubtitle}>
                    Operational supervisory setpoints. Breaches automatically trigger rule-based alarms in Fault Locator and Dashboard.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {thresholds.map((rule) => (
                <div
                  key={rule.id}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--color-surface-alt)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{rule.name}</span>
                    <Badge variant="neutral">{rule.operator} {rule.value} {rule.unit}</Badge>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: 8 }}>
                    {rule.description}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <input
                      type="range"
                      min={rule.unit === '%' ? 60 : rule.unit === 'V' ? 180 : 40}
                      max={rule.unit === '%' ? 100 : rule.unit === 'V' ? 260 : 100}
                      value={rule.value}
                      onChange={(e) => updateThreshold(rule.id, Number(e.target.value))}
                      style={{ flex: 1, accentColor: 'var(--color-primary)' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 'bold', width: '60px', textAlign: 'right' }}>
                      {rule.value} {rule.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.actionsBar}>
              <Button
                variant="danger"
                size="sm"
                leftIcon={<RotateCcw size={14} />}
                onClick={() => setIsResetDialogOpen(true)}
              >
                Reset Digital Twin State
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reset Confirmation Dialog ── */}
      <Dialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        title="Reset Smart Grid State"
        size="md"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, width: '100%' }}>
            <Button variant="secondary" onClick={() => setIsResetDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleResetBaselineState}>
              Confirm Reset
            </Button>
          </div>
        }
      >
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', margin: 0, lineHeight: 1.5 }}>
          This will restore the <strong>Maharashtra Smart Grid Digital Twin</strong> to its nominal baseline state. All simulated fault injections, modified thresholds, and preferences will be restored to defaults.
        </p>
      </Dialog>
    </div>
  );
}
